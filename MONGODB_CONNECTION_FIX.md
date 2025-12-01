# MongoDB Connection String Fix

## The Problem

The error `querySrv EBADNAME` occurs when the MongoDB connection string is malformed.

## Common Issues and Fixes

### Issue 1: Special Characters in Password

If your password contains special characters like `@`, `#`, `%`, `&`, etc., they must be **URL-encoded**.

**Special Character Encoding:**
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `/` → `%2F`
- `?` → `%3F`
- `=` → `%3D`

### Issue 2: Missing Database Name

Always include the database name in your connection string:
```
mongodb+srv://user:pass@cluster.net/database_name
```

### Issue 3: Incorrect Query Parameters

Use standard MongoDB connection parameters:
```
?retryWrites=true&w=majority
```

## Correct Connection String Format

```
mongodb+srv://username:encoded_password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

## How to URL-Encode Your Password

### Using Node.js:
```bash
node -e "console.log(encodeURIComponent('your-password-here'))"
```

### Using Online Tool:
- Go to: https://www.urlencoder.org/
- Paste your password
- Copy the encoded version

## Example

**Before (WRONG):**
```
mongodb+srv://user:pass@123@cluster.net/?appName=Cluster0
```

**After (CORRECT):**
```
mongodb+srv://user:pass%40123@cluster.net/hamroshop?retryWrites=true&w=majority
```

## Your Fixed Connection String

Your connection string has been updated to:
```
mongodb+srv://masummgr:masummagar%4006@cluster0.uhpwxtm.mongodb.net/hamroshop?retryWrites=true&w=majority
```

**Changes made:**
- ✅ Removed angle brackets `<masummagar@06>` → `masummagar%4006`
- ✅ Encoded `@` in password as `%40`
- ✅ Added database name `/hamroshop`
- ✅ Fixed query parameters

## Testing

Now restart your server:
```bash
npm run dev
```

You should see: `Connected to MongoDB` ✅


