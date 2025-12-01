# eSewa Payment Gateway Setup

## Environment Variables Required

To enable eSewa payment integration, you need to set these environment variables in your Render backend:

### Required Variables

```env
# eSewa Environment (uat for testing, prod for production)
ESEWA_ENV=uat

# eSewa Product Code (get from eSewa merchant dashboard)
ESEWA_PRODUCT_CODE=EPAYTEST

# eSewa Secret Key (get from eSewa merchant dashboard)
ESEWA_SECRET_KEY=your_esewa_secret_key_here

# eSewa Form URLs
ESEWA_FORM_URL_UAT=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_FORM_URL_PROD=https://epay.esewa.com.np/api/epay/main/v2/form

# eSewa Status Check URLs
ESEWA_STATUS_URL_UAT=https://rc-epay.esewa.com.np/api/epay/transaction/status/
ESEWA_STATUS_URL_PROD=https://epay.esewa.com.np/api/epay/transaction/status/

# Backend URL (for eSewa callbacks)
BACKEND_URL=https://your-backend.onrender.com

# Success and Failure URLs (eSewa will POST to these)
ESEWA_SUCCESS_URL=https://your-backend.onrender.com/api/payments/esewa/success
ESEWA_FAILURE_URL=https://your-backend.onrender.com/api/payments/esewa/failure
```

### Optional Variables

```env
# Enable test mode (uses test payment page instead of real eSewa)
ESEWA_TEST_MODE=false
```

## For Testing (Test Mode)

If you want to test without real eSewa integration:

```env
ESEWA_TEST_MODE=true
```

When `ESEWA_TEST_MODE=true`, the system will redirect to a test payment page instead of eSewa.

## Common Issues

### 404 Error When Redirecting to eSewa

**Problem:** `ESEWA_FORM_URL_UAT` or `ESEWA_FORM_URL_PROD` is not set.

**Solution:** 
1. Go to Render Dashboard → Your Service → Environment
2. Add `ESEWA_FORM_URL_UAT` with value: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
3. Restart the service

### Payment Gateway Not Configured Error

**Problem:** Missing `ESEWA_SECRET_KEY` or `ESEWA_PRODUCT_CODE`.

**Solution:**
1. Get your credentials from eSewa merchant dashboard
2. Add them to Render environment variables
3. Restart the service

### Form Submission Fails

**Problem:** Backend URL not configured correctly.

**Solution:**
1. Set `BACKEND_URL` to your Render backend URL (e.g., `https://your-backend.onrender.com`)
2. Make sure `ESEWA_SUCCESS_URL` and `ESEWA_FAILURE_URL` point to your backend
3. Restart the service

## Getting eSewa Credentials

1. Register as a merchant at [eSewa](https://esewa.com.np)
2. Complete merchant verification
3. Get your:
   - Product Code
   - Secret Key
   - API endpoints

## Testing

### Test Mode (Recommended for Development)

Set `ESEWA_TEST_MODE=true` to use the test payment page. This allows you to test the flow without real payments.

### UAT Environment

Use `ESEWA_ENV=uat` with UAT URLs for testing with eSewa's test environment.

### Production

Use `ESEWA_ENV=prod` with production URLs and real credentials for live payments.

## Quick Setup Checklist

- [ ] `ESEWA_ENV` set to `uat` or `prod`
- [ ] `ESEWA_PRODUCT_CODE` set
- [ ] `ESEWA_SECRET_KEY` set
- [ ] `ESEWA_FORM_URL_UAT` set (for UAT)
- [ ] `ESEWA_FORM_URL_PROD` set (for production)
- [ ] `ESEWA_STATUS_URL_UAT` set (for UAT)
- [ ] `ESEWA_STATUS_URL_PROD` set (for production)
- [ ] `BACKEND_URL` set to your Render backend URL
- [ ] `ESEWA_SUCCESS_URL` set
- [ ] `ESEWA_FAILURE_URL` set
- [ ] Service restarted after adding variables

