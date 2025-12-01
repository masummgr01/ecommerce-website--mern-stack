# Real eSewa Payment Setup with Test Credentials

## eSewa Test Credentials

For testing phase, use these eSewa test credentials:

**eSewa User Accounts (for testing payments):**
- eSewa ID: `9806800001`, `9806800002`, `9806800003`, `9806800004`, or `9806800005`
- Password: `Nepal@123`
- MPIN: `1122` (for application only)
- Token: `123456`

**Note:** These are test user accounts. You'll use one of these to log into eSewa and make test payments.

## Render Environment Variables Setup

Go to **Render Dashboard** → Your Backend Service → **Environment** and add these:

```env
# Disable test mode to use real eSewa
ESEWA_TEST_MODE=false

# Use UAT environment for testing
ESEWA_ENV=uat

# Product Code for UAT/Testing (usually EPAYTEST)
ESEWA_PRODUCT_CODE=EPAYTEST

# Secret Key - From eSewa documentation for Epay-v2
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q

# eSewa UAT URLs
ESEWA_FORM_URL_UAT=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_FORM_URL_PROD=https://epay.esewa.com.np/api/epay/main/v2/form

# eSewa Status Check URLs
ESEWA_STATUS_URL_UAT=https://rc-epay.esewa.com.np/api/epay/transaction/status/
ESEWA_STATUS_URL_PROD=https://epay.esewa.com.np/api/epay/transaction/status/

# Your Backend URL (replace with your actual Render URL)
BACKEND_URL=https://ecommerce-website-mern-stack-ogp1.onrender.com

# Success and Failure Callback URLs
ESEWA_SUCCESS_URL=https://ecommerce-website-mern-stack-ogp1.onrender.com/api/payments/esewa/success
ESEWA_FAILURE_URL=https://ecommerce-website-mern-stack-ogp1.onrender.com/api/payments/esewa/failure
```

## Important Notes

1. **ESEWA_SECRET_KEY**: The value `123456` is the token you mentioned. However, for real eSewa integration, you typically need a proper secret key from eSewa merchant dashboard. If `123456` doesn't work, you may need to:
   - Register as a merchant at eSewa
   - Get your actual secret key from merchant dashboard
   - Or contact eSewa support for UAT credentials

2. **Test User Accounts**: The eSewa IDs (9806800001-5) are for **logging into eSewa** to make test payments. They are NOT merchant credentials.

3. **Product Code**: `EPAYTEST` is typically used for UAT/testing. For production, you'll get a different product code.

## Testing the Payment Flow

1. **Set up environment variables** in Render (as shown above)
2. **Restart** your Render service
3. **Go through checkout** on your site
4. **You'll be redirected to eSewa payment page**
5. **Login with test credentials:**
   - eSewa ID: `9806800001` (or 2, 3, 4, 5)
   - Password: `Nepal@123`
6. **Complete the payment**
7. **You'll be redirected back** to your site

## If Secret Key Doesn't Work

If you get signature errors, the `ESEWA_SECRET_KEY` might need to be different. Options:

1. **Contact eSewa Support** for UAT merchant credentials
2. **Register as merchant** at [eSewa](https://esewa.com.np) and get real credentials
3. **Check eSewa documentation** for test merchant credentials

## Current Setup Status

✅ Payment form submission configured
✅ Success/failure callbacks configured  
✅ Signature generation implemented
✅ Transaction verification ready

You just need to set the environment variables in Render!

