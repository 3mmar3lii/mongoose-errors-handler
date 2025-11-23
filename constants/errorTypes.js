const ERROR_TYPES = Object.freeze({
  CAST_ERROR: "CastError",
  VALIDATION_ERROR: "ValidationError",
  DUPLICATE_KEY: ["11000", "MongoServerError"],
  UNHNADLEDREJECTION: "unhandledRejection",
  REJECTEDHANDLED: "rejectedhandled", 
});

export default ERROR_TYPES;
