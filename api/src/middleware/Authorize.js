import expressJwt from 'express-jwt';

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  const secret = process.env.SECRET;

  return [
    expressJwt(secret),
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).json({
          status: 'Unauthorized',
          message: 'Tidak memiliki akses',
        });
      }
      next();
    },
  ];
};

export default authorize;
