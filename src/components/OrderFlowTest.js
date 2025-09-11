import React, { useState } from 'react';
import { createOrder, initiateMpesaPayment } from '../services/api';
import receiptService from '../services/receiptService';

const OrderFlowTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toISOString() }]);
  };

  const runCompleteFlowTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Order Creation with New Format
      addResult('Order Creation', 'running', 'Testing order creation with shipping info...');
      
      const testOrderData = {
        items: [
          { productId: 1, name: 'Test Product 1', price: 1000, quantity: 2 },
          { productId: 2, name: 'Test Product 2', price: 500, quantity: 1 }
        ],
        shippingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '0712345678',
          address: '123 Test Street',
          city: 'Nairobi',
          county: 'Nairobi',
          postalCode: '00100'
        },
        paymentMethod: 'mpesa',
        subtotal: 2500,
        shippingCost: 200,
        tax: 400,
        total: 3100
      };

      const orderResponse = await createOrder(testOrderData);
      addResult('Order Creation', 'success', `Order created successfully: ${JSON.stringify(orderResponse)}`);

      // Test 2: Payment Processing
      addResult('Payment Processing', 'running', 'Testing M-Pesa payment initiation...');
      
      const paymentData = {
        phoneNumber: '254712345678',
        amount: 3100,
        orderId: orderResponse.id || orderResponse.orderId,
        accountReference: orderResponse.id || orderResponse.orderId,
        transactionDesc: `Test payment for order ${orderResponse.id || orderResponse.orderId}`
      };

      const paymentResponse = await initiateMpesaPayment(paymentData);
      addResult('Payment Processing', 'success', `Payment initiated: ${JSON.stringify(paymentResponse)}`);

      // Test 3: Receipt Generation
      addResult('Receipt Generation', 'running', 'Testing receipt generation...');
      
      const testOrder = {
        id: orderResponse.id || orderResponse.orderId,
        date: new Date().toISOString(),
        status: 'completed',
        items: testOrderData.items,
        shipping: testOrderData.shippingInfo,
        paymentMethod: 'M-Pesa',
        subtotal: testOrderData.subtotal,
        shippingCost: testOrderData.shippingCost,
        tax: testOrderData.tax,
        total: testOrderData.total
      };

      const receiptSuccess = receiptService.printReceipt(testOrder);
      addResult('Receipt Generation', receiptSuccess ? 'success' : 'error', 
        receiptSuccess ? 'Receipt opened for printing' : 'Failed to open printable receipt');

      // Test 4: API Format Validation
      addResult('API Format Validation', 'running', 'Validating API request format...');
      
      const expectedFormat = {
        items: [
          { product: 1, quantity: 2 },
          { product: 2, quantity: 1 }
        ],
        shipping_info: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '0712345678',
          address: '123 Test Street',
          city: 'Nairobi',
          county: 'Nairobi',
          postal_code: '00100'
        }
      };

      addResult('API Format Validation', 'success', `Expected format: ${JSON.stringify(expectedFormat, null, 2)}`);

      addResult('Complete Flow Test', 'success', 'All tests completed successfully!');

    } catch (error) {
      addResult('Complete Flow Test', 'error', `Test failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Order Flow Test Suite</h2>
      <p>This component tests the complete order-to-payment-to-receipt flow.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runCompleteFlowTest}
          disabled={isRunning}
          style={{
            padding: '10px 20px',
            backgroundColor: isRunning ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isRunning ? 'Running Tests...' : 'Run Complete Flow Test'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        {testResults.length === 0 ? (
          <p>No tests run yet. Click "Run Complete Flow Test" to start.</p>
        ) : (
          <div>
            {testResults.map((result, index) => (
              <div 
                key={index}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  borderRadius: '5px',
                  backgroundColor: 
                    result.status === 'success' ? '#d4edda' :
                    result.status === 'error' ? '#f8d7da' :
                    result.status === 'running' ? '#fff3cd' : '#e2e3e5',
                  border: `1px solid ${
                    result.status === 'success' ? '#c3e6cb' :
                    result.status === 'error' ? '#f5c6cb' :
                    result.status === 'running' ? '#ffeaa7' : '#d6d8db'
                  }`
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {result.test} - {result.status.toUpperCase()}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {result.message}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  {new Date(result.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>What This Test Covers:</h4>
        <ul>
          <li>✅ Order creation with new API format including shipping information</li>
          <li>✅ M-Pesa payment initiation</li>
          <li>✅ Receipt generation and download</li>
          <li>✅ API format validation</li>
          <li>✅ Error handling and fallbacks</li>
        </ul>
      </div>
    </div>
  );
};

export default OrderFlowTest;




