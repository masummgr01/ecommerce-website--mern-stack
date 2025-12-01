# Fixing eSewa Signature Error (ES104)

## Error: "Invalid payload signature"

This error means the signature format doesn't match what eSewa expects.

## Common Causes

1. **Wrong Secret Key**: The `ESEWA_SECRET_KEY` might not be correct
2. **Signature Format**: The message format for signature might be wrong
3. **Field Values**: Values might not be in the correct format (must be strings)

## Solution

### Step 1: Verify Secret Key

The secret key `123456` might not be the actual secret key. You may need:

1. **Contact eSewa Support** for UAT merchant credentials
2. **Register as merchant** and get your actual secret key
3. **Check eSewa documentation** for test merchant credentials

### Step 2: Check Environment Variables

Make sure in Render you have:

```env
ESEWA_SECRET_KEY=123456
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_ENV=uat
ESEWA_TEST_MODE=false
```

### Step 3: Verify Signature Generation

The signature is generated from:
```
total_amount=<amount>,transaction_uuid=<uuid>,product_code=<code>
```

All values must be **strings**, not numbers.

## If 123456 Doesn't Work

The token `123456` you mentioned might not be the secret key. You may need:

1. **Actual Secret Key from eSewa**: Contact eSewa support
2. **Merchant Registration**: Register and get credentials
3. **UAT Credentials**: Request UAT merchant credentials from eSewa

## Testing

After updating the secret key:

1. Restart Render service
2. Try checkout again
3. Check Render logs for signature generation details
4. If still fails, the secret key is likely incorrect

## Alternative: Use Test Mode

If you can't get the secret key working, you can use test mode:

```env
ESEWA_TEST_MODE=true
```

This will use your test payment page instead of real eSewa.

