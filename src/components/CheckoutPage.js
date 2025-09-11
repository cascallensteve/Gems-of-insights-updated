import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder, initiateMpesaPayment, checkPaymentStatus, getTransactionStatus } from '../services/api';
import receiptService from '../services/receiptService';
// Tailwind conversion: removed external CSS import
import { useNotifications } from '../context/NotificationContext';

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [committedTotal, setCommittedTotal] = useState(null);
  const [committedItems, setCommittedItems] = useState([]);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    county: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState({});

  const toNumber = (value) => {
    if (typeof value === 'number') return isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const n = parseFloat(value.replace(/[^\d.-]/g, ''));
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  const subtotal = Math.max(0, Math.round(getCartTotal()));
  const shippingCost = 0; // Removed shipping from summary
  const tax = 0; // Removed VAT from summary
  const total = subtotal; // Only real product amount
  const displayTotal = (committedTotal !== null && committedTotal !== undefined) ? committedTotal : total;

  // Auth gate: redirect to login if not signed in
  useEffect(() => {
    if (!currentUser) {
      const next = encodeURIComponent('/checkout');
      window.location.href = `/login?next=${next}`;
    }
  }, [currentUser]);

  const counties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
    'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
    'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
    'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
      if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
      if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
      if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
      if (!shippingInfo.county) newErrors.county = 'County is required';
    }

    if (step === 2) {
      if (!mpesaPhone.trim()) newErrors.mpesaPhone = 'M-Pesa phone number is required';
      
      const formattedPhone = formatPhoneNumber(mpesaPhone);
      if (!/^254\d{9}$/.test(formattedPhone)) {
        newErrors.mpesaPhone = 'Please enter a valid Kenyan phone number (e.g., 0712345678, +254712345678, or 254712345678)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Always scroll to top when step changes (Next/Back) for better UX
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (_e) {
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  const formatPhoneNumber = (phone) => {
    // Convert to 254 format
    let formatted = phone.replace(/\s/g, '');
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('+254')) {
      formatted = formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    return formatted;
  };

  const handlePlaceOrder = async () => {
    // Block order creation if not authenticated
    if (!currentUser) {
      alert('Please sign in to continue to checkout.');
      const next = encodeURIComponent('/checkout');
      window.location.href = `/login?next=${next}`;
      return;
    }
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      // Create order with new format
      const currentTotal = Math.max(0, Math.round(getCartTotal()));
      setCommittedTotal(currentTotal);
      setCommittedItems(cartItems.map(i => ({ ...i })));
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingInfo,
        paymentMethod,
        subtotal: currentTotal,
        shippingCost,
        tax,
        total: Math.round(currentTotal * 100) / 100 // Round to 2 decimal places
      };

      const orderResponse = await createOrder(orderData);
      const newOrderId = orderResponse.id || orderResponse.orderId || `ORD-${Date.now()}`;
      setOrderId(newOrderId);
      // Notify admin about new order
      addNotification({
        type: 'success',
        title: 'New Order Placed',
        message: `Order #${newOrderId} placed by ${shippingInfo.firstName} ${shippingInfo.lastName}`,
        details: {
          'Email': shippingInfo.email,
          'Phone': shippingInfo.phone,
          'Total': `KSH ${Math.round(currentTotal).toLocaleString()}`
        },
        temporary: false
      });

      // Initiate M-Pesa payment (only payment method available)
      const formattedPhone = formatPhoneNumber(mpesaPhone);
      const paymentData = {
        phoneNumber: formattedPhone,
        amount: Math.round(currentTotal),
        orderId: newOrderId,
        accountReference: newOrderId,
        transactionDesc: `Payment for order ${newOrderId}`
      };

      const paymentResponse = await initiateMpesaPayment(paymentData);
      
      if (paymentResponse.success && paymentResponse.checkoutRequestId) {
        setPaymentStatus('pending');
        // Do not clear cart here; only clear on successful payment
        
        // Check payment status periodically
        const checkInterval = setInterval(async () => {
          try {
            // Prefer GET transaction status endpoint
            let completed = false;
            try {
              const tx = await getTransactionStatus(paymentResponse.checkoutRequestId);
              if (tx && (tx.status === 'success' || tx.status === 'completed' || tx.status === 'paid')) {
                completed = true;
              } else if (tx && (tx.status === 'failed' || tx.status === 'error' || tx.status === 'timeout')) {
                setPaymentStatus('failed');
                clearInterval(checkInterval);
                addNotification({
                  type: 'warning',
                  title: 'Payment Failed',
                  message: `Payment failed for order #${newOrderId}`,
                  details: {
                    'Order ID': newOrderId,
                    'Amount': `KSH ${Math.round(currentTotal).toLocaleString()}`
                  },
                  temporary: false
                });
                return;
              }
            } catch (ignored) {
              // Fallback to legacy status check below
            }

            if (!completed) {
              const statusResponse = await checkPaymentStatus(
                paymentResponse.checkoutRequestId,
                paymentResponse.merchantRequestId
              );
              const resultCode = (statusResponse?.resultCode || '').toString();
              if (resultCode === '0') {
                completed = true;
              } else if (
                resultCode &&
                ['1032', '1037', '1', '2001', '9999'].includes(resultCode)
              ) {
                setPaymentStatus('failed');
                clearInterval(checkInterval);
                addNotification({
                  type: 'warning',
                  title: 'Payment Failed',
                  message: `Payment failed for order #${newOrderId}`,
                  details: {
                    'Order ID': newOrderId,
                    'Amount': `KSH ${Math.round(currentTotal).toLocaleString()}`
                  },
                  temporary: false
                });
                return;
              }
            }

            if (completed) {
              setPaymentStatus('completed');
              setOrderPlaced(true);
              clearInterval(checkInterval);
              // Clear cart only after confirmed payment
              clearCart();
              // Notify admin about payment completion
              addNotification({
                type: 'success',
                title: 'Payment Confirmed',
                message: `Payment received for order #${newOrderId}`,
                details: {
                  'Order ID': newOrderId,
                  'Amount': `KSH ${Math.round(currentTotal).toLocaleString()}`
                },
                temporary: false
              });
            } else {
              // If neither completed nor failed, keep pending; UI banner is visible
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
          }
        }, 5000);

        // Stop checking after 5 minutes
        setTimeout(() => {
          clearInterval(checkInterval);
          if (paymentStatus === 'pending') {
            setPaymentStatus('timeout');
          }
        }, 300000);
      } else {
        // If the backend responded but without a checkout ID, treat as failure
        const msg = paymentResponse?.message || 'Payment initiation failed';
        throw new Error(msg);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      setErrors({ submit: error.message || 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced && paymentStatus === 'completed') {
    return (
      <div className="mt-[64px] md:mt-[72px]">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-xl border border-emerald-100 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white">✅</div>
            <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
            <p className="mt-1 text-gray-700">{`Your order #${orderId} has been confirmed and payment received.`}</p>

            {paymentStatus === 'completed' && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <h3 className="font-semibold">Payment Received</h3>
                <p>Thank you! Your payment was successful.</p>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-emerald-100 bg-white p-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              <p className="text-gray-700"><strong>Order ID:</strong> {orderId}</p>
              <p className="text-gray-700"><strong>Total Amount:</strong> KSH {total.toLocaleString()}</p>
              <p className="text-gray-700"><strong>Payment Method:</strong> M-Pesa Mobile Money</p>
              <p className="text-gray-700"><strong>Delivery Address:</strong> {shippingInfo.address}, {shippingInfo.city}</p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button 
                className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600" 
                onClick={() => window.location.href = '/orders'}
              >
                View My Orders
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50" 
                onClick={() => {
                  const orderData = {
                    id: orderId,
                    date: new Date().toISOString(),
                    status: 'completed',
                    items: (committedItems && committedItems.length ? committedItems : cartItems),
                    shipping: shippingInfo,
                    paymentMethod: 'M-Pesa',
                    subtotal: subtotal,
                    shippingCost: shippingCost,
                    tax: tax,
                    total: total
                  };
                  receiptService.printReceipt(orderData);
                }}
              >
                🖨️ Print Receipt
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50" 
                onClick={() => window.location.href = '/shop'}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {paymentStatus === 'pending' && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow">
              <span className="text-xl">📲</span>
              <div>
                <strong className="block">Awaiting Payment</strong>
                <div>Check your phone for the M-Pesa prompt and enter your PIN to pay KSH {((committedTotal ?? total) || 0).toLocaleString()}.</div>
              </div>
            </div>
          )}
          {paymentStatus === 'failed' && (
            <div className="mb-4 rounded-xl border border-red-200 bg-white p-4 shadow">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-700 text-lg">✖</div>
                <div className="flex-1">
                  <div className="mb-1 text-base font-extrabold text-red-800">Payment Failed</div>
                  <div className="text-red-900/90">The transaction did not complete. Please try again or use a different M-Pesa number.</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => { setPaymentStatus(''); setCurrentStep(2); }} className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700">
                  Try Again
                </button>
                <button onClick={() => { setPaymentStatus(''); setCurrentStep(2); }} className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50">
                  Change Number
                </button>
              </div>
            </div>
          )}
          {paymentStatus === 'timeout' && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-900">
              <strong>Payment Timeout:</strong> We did not receive confirmation in time. If you approved the payment, check SMS; otherwise, try again.
            </div>
          )}
          {/* Main Content */}
          <div className="md:col-span-2">
            {currentStep === 1 && (
              <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <button 
                    className="text-sm text-gray-700 hover:text-emerald-700"
                    onClick={() => window.location.href = '/cart'}
                  >
                    ← Back to Cart
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-md border ${errors.firstName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    />
                    {errors.firstName && <span className="text-sm text-red-600">{errors.firstName}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-md border ${errors.lastName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    />
                    {errors.lastName && <span className="text-sm text-red-600">{errors.lastName}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-md border ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    />
                    {errors.email && <span className="text-sm text-red-600">{errors.email}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="0712345678"
                      className={`mt-1 w-full rounded-md border ${errors.phone ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    />
                    {errors.phone && <span className="text-sm text-red-600">{errors.phone}</span>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Street address, building, apartment"
                      className={`mt-1 w-full rounded-md border ${errors.address ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    />
                    {errors.address && <span className="text-sm text-red-600">{errors.address}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-md border ${errors.city ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    />
                    {errors.city && <span className="text-sm text-red-600">{errors.city}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">County *</label>
                    <select
                      name="county"
                      value={shippingInfo.county}
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-md border ${errors.county ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    >
                      <option value="">Select County</option>
                      {counties.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                    {errors.county && <span className="text-sm text-red-600">{errors.county}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                
                <div className="mt-2 rounded-lg border border-emerald-100 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-20 overflow-hidden rounded bg-white">
                      <img 
                        src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1755521690/download_fab1uz.png" 
                        alt="M-Pesa"
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="text-emerald-600 font-bold text-base">M-PESA</div>'; }}
                        className="h-10 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">M-Pesa Mobile Money</h3>
                      <p className="text-sm text-gray-700">Fast, secure & instant payment</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-emerald-800">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5">✓ Instant Processing</span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5">✓ Secure Payment</span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5">✓ No Additional Fees</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M-Pesa Details - Always show since it's the only payment method */}
                {true && (
                  <div className="mt-3 rounded-lg border border-emerald-100 bg-white p-4">
                    <h3 className="font-semibold text-gray-900">M-Pesa Payment Details</h3>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">M-Pesa Phone Number *</label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="254712345678"
                        className={`mt-1 w-full rounded-md border ${errors.mpesaPhone ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                      />
                      {errors.mpesaPhone && <span className="text-sm text-red-600">{errors.mpesaPhone}</span>}
                      <small className="mt-1 block text-gray-600">Enter your M-Pesa registered phone number (e.g., 0712345678, +254712345678, or 254712345678)</small>
                      <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                        <p className="font-semibold">📱 Phone Number Format:</p>
                        <ul className="list-disc pl-5">
                          <li>✅ 0712345678 (will be converted to 254712345678)</li>
                          <li>✅ +254712345678 (will be converted to 254712345678)</li>
                          <li>✅ 254712345678 (already in correct format)</li>
                          <li>❌ 712345678 (missing country code)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Review Your Order</h2>
                
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h3 className="font-semibold text-gray-900">Shipping Information</h3>
                    <div className="mt-2 text-sm text-gray-700">
                      <p><strong>{shippingInfo.firstName} {shippingInfo.lastName}</strong></p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.county} {shippingInfo.postalCode}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h3 className="font-semibold text-gray-900">Payment Method</h3>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>M-Pesa Mobile Money ({mpesaPhone})</p>
                      <small>Instant & Secure Payment</small>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-4 md:col-span-2">
                    <h3 className="font-semibold text-gray-900">Order Items</h3>
                    <div className="mt-2 space-y-2">
                      {cartItems.map(item => (
                        <div key={item.id} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-md border border-emerald-100 bg-white p-3">
                          <img className="h-16 w-16 rounded object-cover" src={item.image} alt={item.name} />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            KSH {(toNumber(item.price) * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-4 flex items-center justify-between">
              {currentStep > 1 && (
                <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={handleBack}>
                  ← Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600" onClick={handleNext}>
                  Continue →
                </button>
              ) : (
                <button 
                  className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60" 
                  onClick={handlePlaceOrder}
                  disabled={loading || total <= 0}
                >
                  {loading ? 'Processing...' : `Place Order - KSH ${total.toLocaleString()}`}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              
              <div className="mt-3 space-y-2">
                {cartItems.map(item => (
                  <div key={item.id} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-md border border-emerald-100 bg-white p-2">
                    <img className="h-12 w-12 rounded object-cover" src={item.image} alt={item.name} />
                    <div>
                      <span className="block text-sm font-medium text-gray-900">{item.name}</span>
                      <span className="block text-xs text-gray-600">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      KSH {(toNumber(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-2 text-base font-semibold">
                <span>Total:</span>
                <span>KSH {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
