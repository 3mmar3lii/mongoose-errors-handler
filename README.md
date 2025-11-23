# Mongoose Error Handler

A lightweight, production-ready library for handling Mongoose errors in Express.js applications. Automatically converts cryptic Mongoose errors into user-friendly messages with appropriate HTTP status codes.

## Features

✅ **Automatic Error Detection** - No need to check `err.name` or `instanceof`  
✅ **User-Friendly Messages** - Converts technical errors to readable messages  
✅ **HTTP Status Codes** - Returns appropriate status codes (400, 500)  
✅ **Full Error Details** - Provides `isOperational` flag and stack traces (you control what to expose)  
✅ **Express Middleware** - Ready-to-use middleware included  
✅ **TypeScript Support** - Full type definitions included  
✅ **Zero Dependencies** - Only requires Mongoose (peer dependency)

## Installation

```bash
npm install mongoose-errors-handler
```

## Quick Start

### Option 1: Use the Handler in Custom Middleware (Recommended)

This is the **preferred approach** as it gives you full control over error handling logic and response formatting.

```javascript
import express from 'express';
import MongooseErrorHandler from 'mongoose-errors-handler';

const app = express();

// Your routes here...

// Custom error middleware with your own logic
app.use((err, req, res, next) => {
  const handledError = MongooseErrorHandler.handle(err);
  
  // Perform your custom logic here
  // - Log errors to your logging service
  // - Add request context (user ID, request ID, etc.)
  // - Customize response format
  // - Send notifications for critical errors
  
  if (handledError.statusCode) {
    return res.status(handledError.statusCode).json({
      success: false,
      status: handledError.status,
      error: handledError.message,
      isOperational: handledError.isOperational,
      // Add your custom fields here
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }
  
  // Handle unknown errors
  return res.status(500).json({
    success: false,
    error: handledError.message,
    type: handledError.type,
  });
});
```

### Option 2: Use the Built-in Middleware

Quick setup with default error handling.

```javascript
import express from 'express';
import { errorMiddleware } from 'mongoose-errors-handler/middleware';

const app = express();

// Your routes here...

// Add error middleware (must be last)
app.use(errorMiddleware);
```

### Option 3: Use in Try-Catch Blocks

```javascript
import MongooseErrorHandler from 'mongoose-errors-handler';

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    const handled = MongooseErrorHandler.handle(err);
    
    // Your custom logic here
    console.error('Error creating user:', handled);
    
    res.status(handled.statusCode || 500).json({
      success: false,
      error: handled.message
    });
  }
});
```

### Option 4: Use the Async Handler

```javascript
import { asyncHandler } from 'mongoose-errors-handler/middleware';

app.post('/users', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.json({ success: true, data: user });
}));
```

## Error Types Handled

| Error Type | HTTP Status | Example |
|------------|-------------|---------|
| **ValidationError** | 400 | Missing required fields, invalid values |
| **CastError** | 400 | Invalid ObjectId, type conversion errors |
| **DuplicateKeyError** | 400 | Unique constraint violations |
| **Unknown** | 500 | Any other errors |

## API Reference

### `MongooseErrorHandler.handle(err)`

Main error handler that automatically detects and transforms Mongoose errors.

**Parameters:**
- `err` (Error) - The error object to handle

**Returns:**
- For Mongoose errors: `AppError` instance with:
  - `message` (string) - User-friendly error message
  - `statusCode` (number) - HTTP status code (400, 404, 500, etc.)
  - `status` (string) - Either `"fail"` (4xx) or `"error"` (5xx)
  - `isOperational` (boolean) - `true` for expected errors, `false` for bugs
  - `stack` (string) - Full error stack trace
  
- For unknown errors: Plain object with:
  - `type` (string) - Always `"unknown"`
  - `message` (string) - Error message

**Example:**
```javascript
const handled = MongooseErrorHandler.handle(err);
console.log(handled.message);        // "Validation error: Email is required"
console.log(handled.statusCode);     // 400
console.log(handled.status);         // "fail"
console.log(handled.isOperational);  // true
```

### `errorMiddleware(err, req, res, next)`

Express middleware for automatic error handling.

**Response Format:**
```json
{
  "success": false,
  "status": "fail",
  "error": "Error message",
  "isOperational": true,
  "stack": "Error: ...\n    at ..."
}
```

**Response Fields:**
- `success`: Always `false` for errors
- `status`: `"fail"` for 4xx errors, `"error"` for 5xx errors
- `error`: Human-readable error message
- `isOperational`: Boolean flag indicating if this is an expected operational error (`true`) or a programming bug (`false`)
- `stack`: Full error stack trace (always included - you control visibility in your custom middleware)

> **Note:** The built-in middleware returns all fields including `stack`. For production use, it's recommended to create custom middleware where you can filter sensitive information based on your environment.

**Example:**
```javascript
import { errorMiddleware } from 'mongoose-errors-handler/middleware';
app.use(errorMiddleware);
```

### `asyncHandler(fn)`

Wrapper for async route handlers that automatically catches errors.

**Parameters:**
- `fn` (Function) - Async route handler function

**Returns:**
- Express middleware function

**Example:**
```javascript
import { asyncHandler } from 'mongoose-errors-handler/middleware';

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ data: user });
}));
```

## Examples

### Validation Error

```javascript
// Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  age: { type: Number, min: 18 }
});

// Trigger error
await User.create({ age: 15 }); // Missing email, age too low

// Handler output
{
  message: "Validation error: Email is required, Age must be at least 18",
  statusCode: 400,
  isOperational: true
}
```

### Cast Error

```javascript
// Trigger error
await User.findById("invalid-id-format");

// Handler output
{
  message: "Invalid _id: invalid-id-format",
  statusCode: 400,
  isOperational: true
}
```

### Duplicate Key Error

```javascript
// Schema has unique email
await User.create({ email: "test@test.com" });
await User.create({ email: "test@test.com" }); // Duplicate!

// Handler output
{
  message: "Duplicate field value: email. Please use another one!",
  statusCode: 400,
  isOperational: true
}
```

## Best Practices

1. **Use `MongooseErrorHandler.handle()` in custom middleware** - This gives you full control to:
   - Add custom logging logic
   - Include request context (user ID, request ID, etc.)
   - Customize response format to match your API standards
   - Perform additional actions (notifications, metrics, etc.)
   
2. **Always add error middleware last** in your middleware chain

3. **Log errors with context** for better debugging:
   ```javascript
   app.use((err, req, res, next) => {
     const handledError = MongooseErrorHandler.handle(err);
     
     // Log with context
     logger.error({
       error: handledError,
       userId: req.user?.id,
       path: req.path,
       method: req.method,
     });
     
     // Send response
     res.status(handledError.statusCode || 500).json(...);
   });
   ```

4. **Control what gets exposed based on environment**:
   
   The library provides `isOperational` and `stack` fields - you decide what to show:
   
   ```javascript
   app.use((err, req, res, next) => {
     const handledError = MongooseErrorHandler.handle(err);
     
     // Build base response
     const response = {
       success: false,
       status: handledError.status,
       error: handledError.message,
       isOperational: handledError.isOperational, // Always useful
     };
     
     // Only include stack trace in development
     if (process.env.NODE_ENV === 'development') {
       response.stack = handledError.stack;
     }
     
     res.status(handledError.statusCode || 500).json(response);
   });
   ```
   
   **Why this matters:**
   - `isOperational`: Safe to expose - helps distinguish expected errors from bugs
   - `stack`: Sensitive - reveals internal paths and code structure
   - You have full control over what gets sent to clients

5. **Customize responses** to match your API standards:
   ```javascript
   // Example: Add correlation IDs, timestamps, etc.
   res.json({
     success: false,
     error: handledError.message,
     correlationId: req.id,
     timestamp: new Date().toISOString(),
   });
   ```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

Ammar Alaa Ibrahim 
Software Engineer
## Repository

https://github.com/3mmar3lii/mongoose-errors-handler
