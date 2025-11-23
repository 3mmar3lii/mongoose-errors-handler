# Mongoose Error Handler - Complete Usage Guide

> **Quick, clean, and straightforward guide to using mongoose-errors-handler**

---

## 📦 Installation

```bash
npm install mongoose-errors-handler
```

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Import the handler**

```javascript
import MongooseErrorHandler from 'mongoose-errors-handler';
```

### **Step 2: Create error middleware**

```javascript
app.use((err, req, res, next) => {
  const handled = MongooseErrorHandler.handle(err);
  
  if (handled.statusCode) {
    return res.status(handled.statusCode).json({
      success: false,
      error: handled.message,
    });
  }
  
  return res.status(500).json({
    success: false,
    error: handled.message,
  });
});
```

### **Step 3: Done!**

All Mongoose errors are now automatically handled.

---

## 📖 What You Get

When you call `MongooseErrorHandler.handle(err)`, you get:

### **For Mongoose Errors:**
```javascript
{
  message: "Validation error: Email is required",
  statusCode: 400,
  status: "fail",
  isOperational: true,
  stack: "Error: ..."
}
```

### **For Unknown Errors:**
```javascript
{
  type: "unknown",
  message: "Something went wrong"
}
```

---

## 🎯 Usage Patterns

### **Pattern 1: Custom Middleware (Recommended)**

Full control over error handling and response format.

```javascript
import express from 'express';
import MongooseErrorHandler from 'mongoose-errors-handler';

const app = express();

// Your routes...

// Error middleware (must be last)
app.use((err, req, res, next) => {
  const handled = MongooseErrorHandler.handle(err);
  
  // Your custom logic
  console.error('Error:', handled.message);
  
  // Build response
  const response = {
    success: false,
    error: handled.message,
  };
  
  // Add fields from handled error
  if (handled.statusCode) {
    response.status = handled.status;
    response.isOperational = handled.isOperational;
  }
  
  // Only show stack in development
  if (process.env.NODE_ENV === 'development' && handled.stack) {
    response.stack = handled.stack;
  }
  
  res.status(handled.statusCode || 500).json(response);
});
```

---

### **Pattern 2: Built-in Middleware**

Quick setup with default error handling.

```javascript
import { errorMiddleware } from 'mongoose-errors-handler/middleware';

app.use(errorMiddleware);
```

**Response format:**
```json
{
  "success": false,
  "status": "fail",
  "error": "Error message",
  "isOperational": true,
  "stack": "Error: ..."
}
```

> ⚠️ **Note:** Built-in middleware includes stack traces. Use custom middleware for production.

---

### **Pattern 3: Try-Catch Blocks**

Handle errors in specific routes.

```javascript
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    const handled = MongooseErrorHandler.handle(err);
    
    res.status(handled.statusCode || 500).json({
      success: false,
      error: handled.message,
    });
  }
});
```

---

### **Pattern 4: Async Handler Wrapper**

Automatically catch async errors.

```javascript
import { asyncHandler } from 'mongoose-errors-handler/middleware';

app.post('/users', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.json({ success: true, data: user });
}));
```

---

## 🔍 Error Types

| Mongoose Error | Status Code | Example |
|----------------|-------------|---------|
| **ValidationError** | 400 | Missing required fields |
| **CastError** | 400 | Invalid ObjectId |
| **DuplicateKeyError** | 400 | Unique constraint violation |
| **Unknown** | 500 | Any other error |

---

## 📋 Response Fields Explained

### **`message`** (string)
User-friendly error message.
```javascript
"Validation error: Email is required"
```

### **`statusCode`** (number)
HTTP status code.
```javascript
400  // Bad Request
500  // Internal Server Error
```

### **`status`** (string)
Error category.
```javascript
"fail"   // 4xx errors (client errors)
"error"  // 5xx errors (server errors)
```

### **`isOperational`** (boolean)
Is this an expected error?
```javascript
true   // Expected operational error (validation, cast, etc.)
false  // Programming bug (should not happen)
```

### **`stack`** (string)
Full error stack trace.
```javascript
"Error: Validation error\n    at ValidationErrorHandler..."
```

> 💡 **Tip:** Only expose `stack` in development mode.

---

## ✅ Best Practices

### **1. Use Custom Middleware**

```javascript
app.use((err, req, res, next) => {
  const handled = MongooseErrorHandler.handle(err);
  
  // Log errors
  logger.error({
    message: handled.message,
    userId: req.user?.id,
    path: req.path,
  });
  
  // Send response
  res.status(handled.statusCode || 500).json({
    success: false,
    error: handled.message,
  });
});
```

### **2. Hide Stack Traces in Production**

```javascript
const response = {
  success: false,
  error: handled.message,
};

if (process.env.NODE_ENV === 'development') {
  response.stack = handled.stack;
}
```

### **3. Add Request Context**

```javascript
res.json({
  success: false,
  error: handled.message,
  timestamp: new Date().toISOString(),
  path: req.path,
  requestId: req.id,
});
```

### **4. Handle Unhandled Rejections**

```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});
```

---

## 🎨 TypeScript Support

Full TypeScript support included!

```typescript
import MongooseErrorHandler, { AppError } from 'mongoose-errors-handler';

const handled = MongooseErrorHandler.handle(err);

if (handled.statusCode) {
  // TypeScript knows this is AppError
  console.log(handled.status);        // ✅ Type: string
  console.log(handled.isOperational); // ✅ Type: boolean
} else {
  // TypeScript knows this is UnknownErrorResult
  console.log(handled.type);    // ✅ Type: "unknown"
  console.log(handled.message); // ✅ Type: string
}
```

---

## 📝 Complete Example

```javascript
import express from 'express';
import mongoose from 'mongoose';
import MongooseErrorHandler from 'mongoose-errors-handler';

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp');

// Routes
app.post('/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err); // Pass to error middleware
  }
});

// Error middleware (must be last)
app.use((err, req, res, next) => {
  const handled = MongooseErrorHandler.handle(err);
  
  // Log error
  console.error('Error:', {
    message: handled.message,
    path: req.path,
    method: req.method,
  });
  
  // Build response
  const response = {
    success: false,
    error: handled.message,
  };
  
  if (handled.statusCode) {
    response.status = handled.status;
    response.isOperational = handled.isOperational;
  }
  
  // Only in development
  if (process.env.NODE_ENV === 'development' && handled.stack) {
    response.stack = handled.stack;
  }
  
  res.status(handled.statusCode || 500).json(response);
});

// Start server
const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});
```

---

## 🆘 Common Issues

### **Issue: TypeScript errors**

**Solution:** Make sure you have the latest version:
```bash
npm install mongoose-errors-handler@latest
```

### **Issue: Stack traces in production**

**Solution:** Filter them in your custom middleware:
```javascript
if (process.env.NODE_ENV === 'development') {
  response.stack = handled.stack;
}
```

### **Issue: Errors not being caught**

**Solution:** Make sure error middleware is **last**:
```javascript
// Routes first
app.get('/users', ...);
app.post('/users', ...);

// Error middleware LAST
app.use(errorMiddleware);
```

---

## 📚 Additional Resources

- [README.md](./README.md) - Full documentation
- [DEEP_DIVE.md](./DEEP_DIVE.md) - Architecture and internals
- [GitHub Repository](https://github.com/3mmar3lii/mongoose-errors-handler)

---

## 📄 License

MIT

---

**Made with ❤️ by Ammar Alaa Ibrahim**
