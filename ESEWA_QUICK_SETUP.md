# eSewa Quick Setup Guide

## Option 1: Test Mode (Recommended for Development) ✅

**Use this if you want to test the checkout flow without real eSewa credentials.**

### In Render Environment Variables, add:

```env
ESEWA_TEST_MODE=true
ESEWA_ENV=uat
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=test-secret-key-12345
ESEWA_FORM_URL_UAT=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_FORM_URL_PROD=https://epay.esewa.com.np/api/epay/main/v2/form
BACKEND_URL=https://your-backend.onrender.com
ESEWA_SUCCESS_URL=https://your-backend.onrender.com/api/payments/esewa/success
ESEWA_FAILURE_URL=https://your-backend.onrender.com/api/payments/esewa/failure
```

**Important Notes:**
- When `ESEWA_TEST_MODE=true`, the secret key is **NOT used** - you can put any value like `test-secret-key-12345`
- The system will redirect to a **test payment page** instead of real eSewa
- This allows you to test the complete checkout flow without real payments

---

## Option 2: Real eSewa Integration (For Production)

**Use this only if you have real eSewa merchant credentials.**

### Step 1: Get eSewa Credentials

1. Register as a merchant at [eSewa](https://esewa.com.np)
2. Complete merchant verification process
3. Get your credentials from the merchant dashboard:
   - **Product Code** (e.g., `EPAYTEST` for testing, or your real product code)
   - **Secret Key** (a long string provided by eSewa)

### Step 2: In Render Environment Variables, add:

```env
ESEWA_TEST_MODE=false
ESEWA_ENV=uat
ESEWA_PRODUCT_CODE=your_real_product_code_from_esewa
ESEWA_SECRET_KEY=your_real_secret_key_from_esewa
ESEWA_FORM_URL_UAT=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_FORM_URL_PROD=https://epay.esewa.com.np/api/epay/main/v2/form
ESEWA_STATUS_URL_UAT=https://rc-epay.esewa.com.np/api/epay/transaction/status/
ESEWA_STATUS_URL_PROD=https://epay.esewa.com.np/api/epay/transaction/status/
BACKEND_URL=https://your-backend.onrender.com
ESEWA_SUCCESS_URL=https://your-backend.onrender.com/api/payments/esewa/success
ESEWA_FAILURE_URL=https://your-backend.onrender.com/api/payments/esewa/failure
```

**Important:**
- Replace `your_real_product_code_from_esewa` with your actual product code
- Replace `your_real_secret_key_from_esewa` with your actual secret key from eSewa
- Replace `your-backend.onrender.com` with your actual Render backend URL

---

## Quick Answer to Your Questions

### Q: What do I put in ESEWA_SECRET_KEY?

**For Testing (ESEWA_TEST_MODE=true):**
- You can put **any value** like `test-secret-key-12345` or `dummy-key`
- It won't be used when test mode is enabled

**For Production (ESEWA_TEST_MODE=false):**
- You **MUST** put your **real secret key** from eSewa merchant dashboard
- This is a long string provided by eSewa after merchant registration

### Q: Do I need ESEWA_TEST_MODE in .env?

**Yes, you should add it!**

- **For testing/development:** Set `ESEWA_TEST_MODE=true`
- **For production:** Set `ESEWA_TEST_MODE=false`

**If you don't set it:**
- It defaults to `false` (production mode)
- You'll need real eSewa credentials
- You'll get errors if credentials are missing

---

## Recommended Setup for Real eSewa Payment (UAT)

For real eSewa payment with test credentials:

```env
ESEWA_TEST_MODE=false
ESEWA_ENV=uat
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=123456
ESEWA_FORM_URL_UAT=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_FORM_URL_PROD=https://epay.esewa.com.np/api/epay/main/v2/form
ESEWA_STATUS_URL_UAT=https://rc-epay.esewa.com.np/api/epay/transaction/status/
ESEWA_STATUS_URL_PROD=https://epay.esewa.com.np/api/epay/transaction/status/
BACKEND_URL=https://your-backend.onrender.com
ESEWA_SUCCESS_URL=https://your-backend.onrender.com/api/payments/esewa/success
ESEWA_FAILURE_URL=https://your-backend.onrender.com/api/payments/esewa/failure
```

**Test User Credentials (for logging into eSewa):**
- eSewa ID: `9806800001` (or 2, 3, 4, 5)
- Password: `Nepal@123`
- MPIN: `1122`

**Replace `your-backend.onrender.com` with your actual Render backend URL!**

---

## After Adding Variables

1. **Save** the environment variables in Render
2. **Restart** your service (Manual Deploy → Clear build cache & deploy)
3. **Wait** 2-3 minutes for deployment
4. **Test** the checkout flow

---

## Summary

| Mode | ESEWA_TEST_MODE | ESEWA_SECRET_KEY | What Happens |
|------|----------------|------------------|--------------|
| **Test** | `true` | Any value (e.g., `test-123`) | Redirects to test payment page |
| **Production** | `false` | Real key from eSewa | Redirects to real eSewa payment |

**For now, use Test Mode!** ✅

