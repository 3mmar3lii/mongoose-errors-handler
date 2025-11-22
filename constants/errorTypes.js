const ERROR_TYPES = Object.freeze({
  CAST_ERROR: "CastError",
  VALIDATION_ERROR: "ValidationError",
  DUPLICATE_KEY: ["11000", "MongoServerError"],
});

export default ERROR_TYPES;
