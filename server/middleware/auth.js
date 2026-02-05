import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.accessToken || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      console.log("Token missing", { headers: req.headers, cookies: req.cookies });
      return res.status(401).json({
        success: false,
        error: true,
        message: "Authentication token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid authentication token"
      });
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({
      success: false,
      error: true,
      message:
        error.name === "TokenExpiredError"
          ? "Session expired. Please login again."
          : "Authentication failed"
    });
  }
};

export default auth;
