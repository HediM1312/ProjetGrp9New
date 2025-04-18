const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;
    console.log("Headers:", req.headers);
    console.log("Authorization header:", req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Extracted token:", token);
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Non autorisé. Veuillez vous connecter.",
      });
    }

    console.log("Verifying token with secret:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("Found user:", user ? user._id : "No user found");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non trouvé.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      error: "Non autorisé. Token invalide.",
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route.`,
      });
    }
    next();
  };
};
