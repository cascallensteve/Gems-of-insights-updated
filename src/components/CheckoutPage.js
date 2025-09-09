import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder, initiateMpesaPayment, checkPaymentStatus, getTransactionStatus } from '../services/api';
import receiptService from '../services/receiptService';
import './CheckoutPage.css';
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

  const subtotal = Math.max(0, Math.round(getCartTotal()));
  const shippingCost = 0; // Removed shipping from summary
  const tax = 0; // Removed VAT from summary
  const total = subtotal; // Only real product amount
  const displayTotal = (committedTotal !== null && committedTotal !== undefined) ? committedTotal : total;

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
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">
              ✅
            </div>
            
            <h2>
              Order Confirmed!
            </h2>
            
            <p>
              {`Your order #${orderId} has been confirmed and payment received.`}
            </p>

            {paymentStatus === 'completed' && (
              <div className="mpesa-instructions">
                <h3>Payment Received</h3>
                <p>Thank you! Your payment was successful.</p>
              </div>
            )}

            <div className="order-summary">
              <h3>Order Summary</h3>
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Total Amount:</strong> KSH {total.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> M-Pesa Mobile Money</p>
              <p><strong>Delivery Address:</strong> {shippingInfo.address}, {shippingInfo.city}</p>
            </div>

            <div className="success-actions">
              <button 
                className="primary-btn" 
                onClick={() => window.location.href = '/orders'}
              >
                View My Orders
              </button>
              <button 
                className="receipt-btn" 
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
                  receiptService.downloadReceipt(orderData);
                }}
              >
                📄 Download Receipt
              </button>
              <button 
                className="secondary-btn" 
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
    <div className="checkout-page">
      <div className="checkout-container">


        <div className="checkout-content">
          {paymentStatus === 'pending' && (
            <div className="pending-banner" style={{
              background: '#ecfdf5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              padding: '14px 18px',
              borderRadius: 10,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 10px rgba(16,185,129,0.15)'
            }}>
              <span style={{fontSize: 20}}>📲</span>
              <div>
                <strong>Awaiting Payment</strong>
                <div>Check your phone for the M-Pesa prompt and enter your PIN to pay KSH {((committedTotal ?? total) || 0).toLocaleString()}.</div>
              </div>
            </div>
          )}
          {paymentStatus === 'failed' && (
            <div className="failed-box" style={{
              background: '#ffffff',
              border: '1px solid #fecaca',
              borderLeft: '6px solid #ef4444',
              borderRadius: 12,
              padding: 18,
              marginBottom: 18,
              boxShadow: '0 10px 24px rgba(239,68,68,0.12)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0
                }}>✖</div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 800, color: '#991b1b', fontSize: 16, marginBottom: 4}}>Payment Failed</div>
                  <div style={{color: '#7f1d1d', opacity: 0.95, lineHeight: 1.5}}>
                    The transaction did not complete. Please try again or use a different M-Pesa number.
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', gap: 10, marginTop: 14}}>
                <button
                  onClick={() => { setPaymentStatus(''); setCurrentStep(2); }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: '#ef4444',
                    color: '#fff',
                    border: '1px solid #dc2626',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Try Again
                </button>
                <button
                  onClick={() => { setPaymentStatus(''); setCurrentStep(2); }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: '#ffffff',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Change Number
                </button>
              </div>
            </div>
          )}
          {paymentStatus === 'timeout' && (
            <div className="timeout-banner" style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e3a8a',
              padding: '12px 16px',
              borderRadius: 8,
              marginBottom: 16
            }}>
              <strong>Payment Timeout:</strong> We did not receive confirmation in time. If you approved the payment, check SMS; otherwise, try again.
            </div>
          )}
          {/* Main Content */}
          <div className="checkout-main">
            {currentStep === 1 && (
              <div className="shipping-step">
                <div className="step-header">
                  <button 
                    className="back-to-cart-btn"
                    onClick={() => window.location.href = '/cart'}
                  >
                    ← Back to Cart
                  </button>
                  <h2>Shipping Information</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="0712345678"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Street address, building, apartment"
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>County *</label>
                    <select
                      name="county"
                      value={shippingInfo.county}
                      onChange={handleInputChange}
                      className={errors.county ? 'error' : ''}
                    >
                      <option value="">Select County</option>
                      {counties.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                    {errors.county && <span className="error-text">{errors.county}</span>}
                  </div>

                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="payment-step">
                <h2>Payment Method</h2>
                
                <div className="payment-methods">
                  <div className="payment-method-header">
                    <h3>Instant Payment - M-Pesa Only</h3>
                    <p>Secure and instant mobile money payment</p>
                  </div>
                  
                  <div className={`payment-option selected mpesa-only`}>
                    <div className="payment-info">
                      <div className="payment-logo">
                        <img 
                          src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1755521690/download_fab1uz.png" 
                          alt="M-Pesa"
                          onError={(e) => {
                            console.log(`Failed to load M-Pesa logo: ${e.target.src}`);
                            // Fallback to a simple M-Pesa text if image fails
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<div style="color: #00D160; font-weight: bold; font-size: 18px;">M-PESA</div>';
                          }}
                          onLoad={() => console.log(`Successfully loaded M-Pesa logo`)}
                        />
                      </div>
                      <div className="payment-details">
                        <h3>M-Pesa Mobile Money</h3>
                        <p>Fast, secure & instant payment</p>
                        <div className="payment-features">
                          <span className="feature">✓ Instant Processing</span>
                          <span className="feature">✓ Secure Payment</span>
                          <span className="feature">✓ No Additional Fees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* M-Pesa Details - Always show since it's the only payment method */}
                {true && (
                  <div className="mpesa-details">
                    <h3>M-Pesa Payment Details</h3>
                    <div className="form-group">
                      <label>M-Pesa Phone Number *</label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="254712345678"
                        className={errors.mpesaPhone ? 'error' : ''}
                      />
                      {errors.mpesaPhone && <span className="error-text">{errors.mpesaPhone}</span>}
                      <small>Enter your M-Pesa registered phone number (e.g., 0712345678, +254712345678, or 254712345678)</small>
                      <div className="phone-format-info">
                        <p><strong>📱 Phone Number Format:</strong></p>
                        <ul>
                          <li>✅ <strong>0712345678</strong> (will be converted to 254712345678)</li>
                          <li>✅ <strong>+254712345678</strong> (will be converted to 254712345678)</li>
                          <li>✅ <strong>254712345678</strong> (already in correct format)</li>
                          <li>❌ <strong>712345678</strong> (missing country code)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="review-step">
                <h2>Review Your Order</h2>
                
                <div className="review-sections">
                  <div className="review-section">
                    <h3>Shipping Information</h3>
                    <div className="review-content">
                      <p><strong>{shippingInfo.firstName} {shippingInfo.lastName}</strong></p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.county} {shippingInfo.postalCode}</p>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Payment Method</h3>
                    <div className="review-content">
                      <p>M-Pesa Mobile Money ({mpesaPhone})</p>
                      <small>Instant & Secure Payment</small>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Order Items</h3>
                    <div className="review-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="review-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <div className="item-price">
                            KSH {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="error-message">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="checkout-navigation">
              {currentStep > 1 && (
                <button className="back-btn" onClick={handleBack}>
                  ← Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button className="next-btn" onClick={handleNext}>
                  Continue →
                </button>
              ) : (
                <button 
                  className="place-order-btn" 
                  onClick={handlePlaceOrder}
                  disabled={loading || total <= 0}
                >
                  {loading ? 'Processing...' : `Place Order - KSH ${total.toLocaleString()}`}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-total">
                      KSH {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>KSH {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
