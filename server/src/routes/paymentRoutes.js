const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Test mode - disabled by default, set ESEWA_TEST_MODE=true to enable
const TEST_MODE = process.env.ESEWA_TEST_MODE === 'true';

// Generate eSewa signature
// eSewa requires signature to be generated from specific fields in exact order
function generateEsewaSignature(totalAmount, transactionUuid, productCode) {
  // Concatenate fields in exact order: total_amount,transaction_uuid,product_code
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  const secretKey = process.env.ESEWA_SECRET_KEY;
  if (!secretKey || secretKey === 'replace_with_esewa_secret') {
    throw new Error('ESEWA_SECRET_KEY is not configured');
  }
  
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
}

// POST /api/payments/esewa/initiate - initiate eSewa payment
router.post('/esewa/initiate', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ message: 'Order ID and amount are required' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Validate ObjectId format
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Verify order items are still valid
    for (const item of order.items) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({ 
          message: `Product "${item.product?.name || 'Unknown'}" in order is no longer available` 
        });
      }
    }

    // Generate transaction UUID
    const transactionUUID = `hamroshop-${orderId}-${Date.now()}`;

    // Store transaction UUID in order
    order.esewaTransactionId = transactionUUID;
    await order.save();

    // TEST MODE: Only if explicitly enabled
    if (TEST_MODE) {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      return res.json({
        testMode: true,
        paymentUrl: `${clientUrl}/payment/test?orderId=${orderId}&transactionUUID=${transactionUUID}&amount=${amount}`,
        formData: {
          orderId,
          transactionUUID,
          amount,
        },
      });
    }

    // PRODUCTION MODE: Use real eSewa
    const productCode = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
    const secretKey = process.env.ESEWA_SECRET_KEY;
    
    if (!secretKey || secretKey === 'replace_with_esewa_secret') {
      return res.status(500).json({ 
        message: 'eSewa secret key is not configured. Please set ESEWA_SECRET_KEY in your .env file.' 
      });
    }
    
    const env = process.env.ESEWA_ENV || 'uat';
    const formUrl = env === 'prod' 
      ? process.env.ESEWA_FORM_URL_PROD 
      : process.env.ESEWA_FORM_URL_UAT;
    
    // Validate form URL is configured
    if (!formUrl) {
      console.error('eSewa form URL not configured. ESEWA_FORM_URL_UAT or ESEWA_FORM_URL_PROD must be set.');
      return res.status(500).json({ 
        message: 'Payment gateway not configured. Please contact administrator.',
        error: 'ESEWA_FORM_URL not set'
      });
    }
    
    // Use backend URL for success/failure callbacks (eSewa will POST to these)
    const backendUrl = process.env.BACKEND_URL || process.env.CLIENT_URL?.replace(/\/$/, '') || 'http://localhost:5000';
    const successUrl = process.env.ESEWA_SUCCESS_URL || `${backendUrl}/api/payments/esewa/success`;
    const failureUrl = process.env.ESEWA_FAILURE_URL || `${backendUrl}/api/payments/esewa/failure`;

    // Prepare payment data
    const totalAmount = amount.toString();
    
    const paymentData = {
      amount: totalAmount,
      tax_amount: '0',
      total_amount: totalAmount,
      transaction_uuid: transactionUUID,
      product_code: productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
    };

    // Generate signature using only the signed fields in exact order
    // Signature must be: HMAC-SHA256 of "total_amount=X,transaction_uuid=Y,product_code=Z"
    const signature = generateEsewaSignature(totalAmount, transactionUUID, productCode);
    paymentData.signature = signature;
    
    console.log('eSewa Payment Data:', {
      total_amount: totalAmount,
      transaction_uuid: transactionUUID,
      product_code: productCode,
      signature: signature.substring(0, 20) + '...', // Log partial signature for debugging
    });

    // Validate all required fields
    if (!formUrl || !paymentData.signature) {
      console.error('Payment configuration error:', { formUrl, hasSignature: !!paymentData.signature });
      return res.status(500).json({ 
        message: 'Payment gateway configuration error. Please contact administrator.',
        error: 'Missing payment configuration'
      });
    }

    console.log('eSewa Payment initiated:', {
      orderId,
      amount: totalAmount,
      transactionUUID,
      formUrl: formUrl.substring(0, 50) + '...',
    });

    // Return payment URL and form data
    res.json({
      paymentUrl: formUrl,
      formData: paymentData,
    });
  } catch (err) {
    console.error('Error initiating eSewa payment', err);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
});

// POST /api/payments/esewa/test/complete - Test mode: Complete payment
router.post('/esewa/test/complete', async (req, res) => {
  try {
    const { orderId, transactionUUID } = req.body;

    if (!orderId || !transactionUUID) {
      return res.status(400).json({ message: 'Order ID and transaction UUID are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.esewaTransactionId !== transactionUUID) {
      return res.status(400).json({ message: 'Invalid transaction UUID' });
    }

    // Update order payment status
    order.paymentStatus = 'paid';
    order.status = 'paid';
    await order.save();

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQty: -item.quantity },
      });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/payment/success?oid=${order._id}`);
  } catch (err) {
    console.error('Error processing test payment', err);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/payment/failure`);
  }
});

// POST /api/payments/esewa/success - eSewa success callback
router.post('/esewa/success', async (req, res) => {
  try {
    const { data } = req.body;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    if (!data) {
      return res.redirect(`${clientUrl}/payment/failure`);
    }

    // Parse the data (eSewa sends it as a string)
    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const params = new URLSearchParams(decodedData);
    
    const transactionCode = params.get('transaction_code');
    const status = params.get('status');
    const transactionUUID = params.get('transaction_uuid');

    if (status !== 'COMPLETE' || !transactionCode) {
      return res.redirect(`${clientUrl}/payment/failure`);
    }

    // Find order by transaction UUID
    const order = await Order.findOne({ esewaTransactionId: transactionUUID });
    
    if (!order) {
      return res.redirect(`${clientUrl}/payment/failure`);
    }

    // Verify payment with eSewa
    const env = process.env.ESEWA_ENV || 'uat';
    const statusUrl = env === 'prod'
      ? process.env.ESEWA_STATUS_URL_PROD
      : process.env.ESEWA_STATUS_URL_UAT;

    try {
      const verifyRes = await fetch(`${statusUrl}${transactionCode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.ESEWA_SECRET_KEY || ''}`,
        },
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        
        if (verifyData.status === 'COMPLETE') {
          // Update order payment status
          order.paymentStatus = 'paid';
          order.status = 'paid';
          await order.save();

          // Update product stock
          for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stockQty: -item.quantity },
            });
          }

          return res.redirect(`${clientUrl}/payment/success?oid=${order._id}`);
        }
      }
    } catch (verifyErr) {
      console.error('Error verifying payment with eSewa', verifyErr);
    }

    return res.redirect(`${clientUrl}/payment/failure`);
  } catch (err) {
    console.error('Error processing eSewa success', err);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/payment/failure`);
  }
});

// POST /api/payments/esewa/failure - eSewa failure callback
router.post('/esewa/failure', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (data) {
      const decodedData = Buffer.from(data, 'base64').toString('utf-8');
      const params = new URLSearchParams(decodedData);
      const transactionUUID = params.get('transaction_uuid');

      if (transactionUUID) {
        const order = await Order.findOne({ esewaTransactionId: transactionUUID });
        if (order) {
          order.paymentStatus = 'failed';
          await order.save();
        }
      }
    }

    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/failure`);
  } catch (err) {
    console.error('Error processing eSewa failure', err);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/failure`);
  }
});

module.exports = router;

