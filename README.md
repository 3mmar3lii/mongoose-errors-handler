# Mongoose Error Handler

A lightweight, production-ready library for handling Mongoose errors in Express.js applications. Automatically converts cryptic Mongoose errors into user-friendly messages with appropriate HTTP status codes.

## Features

✅ **Automatic Error Detection** - No need to check `err.name` or `instanceof`  
✅ **User-Friendly Messages** - Converts technical errors to readable messages  
✅ **HTTP Status Codes** - Returns appropriate status codes (400, 500)  
✅ **Express Middleware** - Ready-to-use middleware included  
✅ **TypeScript Ready** - Full type definitions (coming soon)  
✅ **Zero Dependencies** - Only requires Mongoose (peer dependency)

## Installation

```bash
npm install mongoose-error-handler
```

## Quick Start

### Option 1: Use the Middleware (Recommended)

```javascript
import express from 'express';
import { errorMiddleware } from 'mongoose-error-handler/middleware';

const app = express();

// Your routes here...

// Add error middleware (must be last)
app.use(errorMiddleware);
```

### Option 2: Use the Handler Directly

```javascript
import MongooseErrorHandler from 'mongoose-error-handler';

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    const handled = MongooseErrorHandler.handle(err);
    res.status(handled.statusCode || 500).json({
      success: false,
      error: handled.message
    });
  }
});
```

### Option 3: Use the Async Handler

```javascript
import { asyncHandler } from 'mongoose-error-handler/middleware';

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
- For Mongoose errors: `AppError` instance with `message`, `statusCode`, and `isOperational`
- For unknown errors: Plain object with `type` and `message`

**Example:**
```javascript
const handled = MongooseErrorHandler.handle(err);
console.log(handled.message); // "Validation error: Email is required"
console.log(handled.statusCode); // 400
```

### `errorMiddleware(err, req, res, next)`

Express middleware for automatic error handling.

**Example:**
```javascript
import { errorMiddleware } from 'mongoose-error-handler/middleware';
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
import { asyncHandler } from 'mongoose-error-handler/middleware';

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

1. **Use the middleware** for consistent error handling across your app
2. **Always add it last** in your middleware chain
3. **Log errors** before handling them for debugging
4. **Don't expose stack traces** in production

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

Ammar Alaa Ibrahim 
Software Engineer
## Repository

https://github.com/3mmar3lii/mongoose-errors-handler
