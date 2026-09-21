const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    if (!allowedRoles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        message: 'Access denied. You do not have permission to access this page.'
      });
    }

    next();
  };
};

module.exports = requireRole;