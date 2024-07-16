// error middleware || NEXT function
export const errorHandler = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;

  // Send the appropriate response with status code and error message
  res.status(statusCode).send({
    message: err.message || "Something went wrong",
    success: false,
    statusCode
  });
};
