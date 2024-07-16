import JWT from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  try {
    // token is always present in headers section not in body section. because in body things  are visible
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next({message:"Authorization Failed"});
    }

    const token = authHeader.split(" ")[1];
    try {
      // this will decrypt the token
      const payload = JWT.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
      };

      next();
    } catch (error) {
      return next(error);
    }
  } catch (error) {
    // When next(error) is called, Express looks for a special error-handling middleware 
    // function that is defined with four parameters (err, req, res, next).
    // This middleware function should be defined after all other middleware functions/routes
    return next(error);
  }
};
