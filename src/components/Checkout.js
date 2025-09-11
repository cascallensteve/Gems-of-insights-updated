import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = ({ cartItems, onClose, onOrderComplete }) => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    county: '',
    town: '',
    postalCode: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
    'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
    'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
    'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (!currentUser) {
      const next = encodeURIComponent('/checkout');
      window.location.href = `/login?next=${next}`;
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      const next = encodeURIComponent('/checkout');
      window.location.href = `/login?next=${next}`;
      return;
    }
    setLoading(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        id: Date.now(),
        items: cartItems,
        shipping: shippingInfo,
        paymentMethod,
        total: calculateTotal(),
        date: new Date().toISOString(),
        status: 'confirmed'
      };

      // Store order in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      onOrderComplete(orderData);
      onClose();
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMpesaPayment = async () => {
    if (!currentUser) {
      const next = encodeURIComponent('/checkout');
      window.location.href = `/login?next=${next}`;
      return;
    }
    setLoading(true);
    
    try {
      // Simulate M-Pesa STK push
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate payment success
      alert('M-Pesa payment successful! Check your phone for the confirmation message.');
      handlePlaceOrder();
    } catch (error) {
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
        <span>1</span>
        <label>Shipping</label>
      </div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
        <span>2</span>
        <label>Review</label>
      </div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
        <span>3</span>
        <label>Payment</label>
      </div>
    </div>
  );

  const renderShippingForm = () => (
    <div className="checkout-section">
      <h3>Shipping Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            name="firstName"
            value={shippingInfo.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={shippingInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleInputChange}
            placeholder="+254 700 000 000"
            required
          />
        </div>
        <div className="form-group full-width">
          <label>Address *</label>
          <textarea
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            placeholder="Street address, building, apartment number"
            required
            rows="2"
          />
        </div>
        <div className="form-group">
          <label>County *</label>
          <select
            name="county"
            value={shippingInfo.county}
            onChange={handleInputChange}
            required
          >
            <option value="">Select County</option>
            {kenyanCounties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Town/City *</label>
          <input
            type="text"
            name="town"
            value={shippingInfo.town}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={shippingInfo.postalCode}
            onChange={handleInputChange}
            placeholder="00100"
          />
        </div>
        <div className="form-group full-width">
          <label>Delivery Notes (Optional)</label>
          <textarea
            name="notes"
            value={shippingInfo.notes}
            onChange={handleInputChange}
            placeholder="Any special delivery instructions"
            rows="2"
          />
        </div>
      </div>
    </div>
  );

  const renderOrderReview = () => (
    <div className="checkout-section">
      <h3>Order Review</h3>
      <div className="order-items">
        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p className="item-price">KSh {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="shipping-summary">
        <h4>Shipping To:</h4>
        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
        <p>{shippingInfo.address}</p>
        <p>{shippingInfo.town}, {shippingInfo.county}</p>
        <p>{shippingInfo.phone}</p>
      </div>
      
      <div className="order-total">
        <div className="total-line">
          <span>Subtotal:</span>
          <span>KSh {calculateTotal().toLocaleString()}</span>
        </div>
        <div className="total-line">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="total-line final">
          <span>Total:</span>
          <span>KSh {calculateTotal().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="checkout-section">
      <h3>Payment Method</h3>
      <div className="payment-methods">
        <div className={`payment-option ${paymentMethod === 'mpesa' ? 'selected' : ''}`}
             onClick={() => setPaymentMethod('mpesa')}>
          <div className="payment-icon">📱</div>
          <div className="payment-details">
            <h4>M-Pesa</h4>
            <p>Pay instantly with M-Pesa STK Push</p>
          </div>
          <div className="payment-radio">
            <input type="radio" checked={paymentMethod === 'mpesa'} readOnly />
          </div>
        </div>
        
        <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
             onClick={() => setPaymentMethod('cod')}>
          <div className="payment-icon">💵</div>
          <div className="payment-details">
            <h4>Cash on Delivery</h4>
            <p>Pay when you receive your order</p>
          </div>
          <div className="payment-radio">
            <input type="radio" checked={paymentMethod === 'cod'} readOnly />
          </div>
        </div>
      </div>
      
      {paymentMethod === 'mpesa' && (
        <div className="mpesa-info">
          <p>💡 You will receive an M-Pesa prompt on your phone number: <strong>{shippingInfo.phone}</strong></p>
          <p>🔒 Your payment is secure and encrypted</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        {renderStepIndicator()}
        
        <div className="checkout-content">
          {currentStep === 1 && renderShippingForm()}
          {currentStep === 2 && renderOrderReview()}
          {currentStep === 3 && renderPayment()}
        </div>
        
        <div className="checkout-actions">
          {currentStep > 1 && (
            <button className="btn-secondary" onClick={handlePreviousStep}>
              ← Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              className="btn-primary" 
              onClick={handleNextStep}
              disabled={currentStep === 1 && (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.county || !shippingInfo.town)}
            >
              Next →
            </button>
          ) : (
            <button 
              className="btn-primary" 
              onClick={paymentMethod === 'mpesa' ? handleMpesaPayment : handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : paymentMethod === 'mpesa' ? 'Pay with M-Pesa' : 'Place Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
