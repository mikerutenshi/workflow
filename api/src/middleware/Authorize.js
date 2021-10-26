import expressJwt from 'express-jwt';
import secret from 'config';

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

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
