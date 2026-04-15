import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies; 
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login again",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // attach decoded payload to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed",
      error: error.message,
    });
  }
};

export default userAuth;
