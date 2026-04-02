const adminAuth = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  // Check if user has admin or super admin role
  if (req.user.role !== 'admin' && req.user.role !== 'super admin') {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  // Super admin has full access
  if (req.user.role === 'super admin') {
    return next();
  }

  // Regular admin has limited access
  if (req.user.role === 'admin') {
    // Add any admin-specific restrictions here if needed
    return next();
  }

  next();
};

module.exports = adminAuth;
