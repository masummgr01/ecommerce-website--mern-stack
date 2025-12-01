# eSewa Test Credentials (From Official Documentation)

## For Epay-v2 Integration (What We're Using)

**Merchant Credentials:**
- **Merchant ID/Service Code:** `EPAYTEST`
- **Secret Key:** `8gBm/:&EnhH.1/q`
- **Token:** `123456` (not used for signature)

**Test User Accounts (for making payments):**
- **eSewa ID:** `9806800001`, `9806800002`, `9806800003`, `9806800004`, or `9806800005`
- **Password:** `Nepal@123`
- **MPIN:** `1122` (for application only)

## Render Environment Variables

Set these in Render Dashboard → Your Service → Environment:

```env
ESEWA_TEST_MODE=false
ESEWA_ENV=uat
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_FORM_URL_UAT=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_FORM_URL_PROD=https://epay.esewa.com.np/api/epay/main/v2/form
ESEWA_STATUS_URL_UAT=https://rc-epay.esewa.com.np/api/epay/transaction/status/
ESEWA_STATUS_URL_PROD=https://epay.esewa.com.np/api/epay/transaction/status/
BACKEND_URL=https://ecommerce-website-mern-stack-ogp1.onrender.com
ESEWA_SUCCESS_URL=https://ecommerce-website-mern-stack-ogp1.onrender.com/api/payments/esewa/success
ESEWA_FAILURE_URL=https://ecommerce-website-mern-stack-ogp1.onrender.com/api/payments/esewa/failure
```

## Important Notes

1. **Secret Key**: `8gBm/:&EnhH.1/q` is the correct secret key for Epay-v2 UAT
2. **Product Code**: `EPAYTEST` is for testing/UAT
3. **Test Users**: Use eSewa IDs 9806800001-5 with password `Nepal@123` to make test payments
4. **Token 123456**: This is not the secret key - it's a separate token (not used in our integration)

## Testing Flow

1. Customer goes through checkout
2. Redirected to eSewa payment page
3. Customer logs in with:
   - eSewa ID: `9806800001` (or 2, 3, 4, 5)
   - Password: `Nepal@123`
4. Completes payment
5. Redirected back to your site

## For SDK Integration (Not Currently Used)

If you want to use SDK instead of form submission:
- **client_id:** `JBOBBQ4aD0UqlThFJwAKBgAXEUkEGQUBBAwdOgABHD4DChwUABOR`
- **client_secret:** `BhwlWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ==`

But our current implementation uses Epay-v2 form submission, so use the Epay-v2 credentials above.

