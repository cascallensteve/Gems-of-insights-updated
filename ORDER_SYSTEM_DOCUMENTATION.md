# Order System Documentation

## Overview
This document describes the updated order creation system that includes shipping information, payment processing, and receipt generation functionality.

## New Order Creation API

### Endpoint
```
POST {{baseURL}}/store/create-order
```

### Request Format
```json
{
  "items": [
    { "product": 2, "quantity": 2 },
    { "product": 3, "quantity": 1 }
  ],
  "shipping_info": {
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "0712345678",
    "address": "123 Main St",
    "city": "Nairobi",
    "county": "Nairobi",
    "postal_code": "00100"
  }
}
```

### Response Format
```json
{
  "id": 20,
  "buyer": 7,
  "status": "pending",
  "created_at": "2025-09-05T13:24:56.570921Z",
  "items": [
    {
      "item": null,
      "quantity": 2
    },
    {
      "item": null,
      "quantity": 1
    }
  ],
  "shipping": {
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "0712345678",
    "address": "123 Main St",
    "city": "Nairobi",
    "county": "Nairobi",
    "postal_code": "00100"
  }
}
```

## Implementation Details

### 1. API Service Updates (`src/services/api.js`)

The `createOrder` function has been updated to:
- Transform order data to match the new API format
- Map `productId` to `product` in items array
- Map shipping information to `shipping_info` object with proper field names
- Maintain backward compatibility with fallback endpoints

### 2. Receipt Service (`src/services/receiptService.js`)

New comprehensive receipt service that provides:
- **Client-side PDF generation** using jsPDF
- **API-based receipt download** with fallback
- **Smart download** that tries API first, falls back to client generation
- **Print functionality** for receipts
- **Professional receipt formatting** with company branding

#### Key Methods:
- `generateReceiptPDF(order)` - Generate PDF receipt
- `downloadReceiptPDF(order)` - Download PDF receipt
- `downloadReceiptFromAPI(orderId)` - Download from API
- `downloadReceipt(order)` - Smart download (API + fallback)
- `printReceipt(order)` - Print receipt

### 3. Checkout Page Updates (`src/components/CheckoutPage.js`)

Enhanced checkout process:
- **New order format** integration
- **Receipt download** on successful payment
- **Improved error handling**
- **Better user feedback**

### 4. Orders Page Updates (`src/components/OrdersPage.js`)

Added receipt functionality:
- **Download receipt** button for each order
- **PDF generation** for order history
- **Professional receipt formatting**

## Complete Order Flow

### 1. Order Creation
```javascript
const orderData = {
  items: cartItems.map(item => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity
  })),
  shippingInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '0712345678',
    address: '123 Main St',
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

const orderResponse = await createOrder(orderData);
```

### 2. Payment Processing
```javascript
const paymentData = {
  phoneNumber: '254712345678',
  amount: 3100,
  orderId: orderResponse.id,
  accountReference: orderResponse.id,
  transactionDesc: `Payment for order ${orderResponse.id}`
};

const paymentResponse = await initiateMpesaPayment(paymentData);
```

### 3. Receipt Generation
```javascript
// Automatic download after successful payment
receiptService.downloadReceipt(orderData);

// Manual download from orders page
receiptService.downloadReceipt(order);
```

## Features

### ✅ Order Management
- New API format with shipping information
- Backward compatibility maintained
- Proper error handling and fallbacks

### ✅ Payment Processing
- M-Pesa STK Push integration
- Payment status monitoring
- Automatic payment confirmation

### ✅ Receipt System
- Professional PDF receipts
- Company branding and formatting
- Multiple download options
- Print functionality
- API and client-side generation

### ✅ User Experience
- Seamless checkout flow
- Real-time payment status
- Instant receipt download
- Order history management

## Testing

### Test Component
Use `OrderFlowTest.js` component to test the complete flow:
- Order creation with new format
- Payment processing
- Receipt generation
- API format validation

### Manual Testing Steps
1. Add items to cart
2. Proceed to checkout
3. Fill shipping information
4. Complete M-Pesa payment
5. Download receipt
6. Verify order in orders page
7. Download receipt from order history

## Error Handling

### API Failures
- Automatic fallback to client-side generation
- Graceful degradation for receipt downloads
- User-friendly error messages

### Payment Failures
- Clear error messaging
- Retry mechanisms
- Status monitoring

### Receipt Generation
- Multiple fallback options
- Error logging
- User notifications

## Security Considerations

- Authentication required for all API calls
- Secure payment processing
- Data validation on both client and server
- Proper error handling without data exposure

## Future Enhancements

- Email receipt delivery
- SMS notifications
- Order tracking integration
- Advanced receipt customization
- Bulk order processing
- Analytics and reporting

## Support

For issues or questions regarding the order system:
- Check the test component for debugging
- Review API response formats
- Verify shipping information completeness
- Ensure proper authentication tokens




