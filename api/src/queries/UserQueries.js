import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import pgp from 'pg-promise';
import randtoken from 'rand-token';

import { db } from '../db';
import { user } from '../sql';
import DateUtil from '../helpers/DateUtil';

const QueryResultError = pgp.errors.QueryResultError;

const User = {
  create(req, res, next) {
    const body = req.body;
    body.password = bcrypt.hashSync(body.password, 10);

    if (!body.last_name) {
      body.last_name = null;
    }

    db.none(user.create, body)
      .then(() => {
        res.status(201).json({
          status: 'Created',
          message: 'User berhasil dibuat',
        });
      })
      .catch((err) => {
        if (err.message.includes('duplicate key value')) {
          return res.status(200).json({
            status: 'OK',
            message: 'User tersebut sudah terdaftar',
          });
        }
        return next(err);
      });
  },
  getAll(req, res, next) {
    const query = 'SELECT * FROM app_user';
    db.any(query)
      .then((result) => {
        const data = result.map((u) => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
        });

        res.status(200).json({
          status: 'OK',
          data,
          message: 'Semua user berhasil diload',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  delete(req, res, next) {
    const ids = req.query.id;
    db.none('DELETE FROM app_user WHERE id in ($1:csv)', [ids])
      .then(() => {
        res.status(200).json({
          status: 'OK',
          message: 'Berhasil menghapus user',
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
  authenticate(req, res, next) {
    db.task(async (t) => {
      try {
        const activeUser = await t.one(
          'SELECT * FROM app_user WHERE username = $1 AND is_active = true',
          req.body.username,
        );

        if (
          activeUser &&
          bcrypt.compareSync(req.body.password, activeUser.password)
        ) {
          const secret = process.env.SECRET;
          const accessToken = jwt.sign(
            { sub: activeUser.id, role: activeUser.role },
            secret,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
          );
          const refreshToken = randtoken.uid(256);
          const encryptedAccessToken = bcrypt.hashSync(refreshToken, 10);
          const { password, ...userWithoutPassword } = activeUser;
          const data = userWithoutPassword;
          data.access_token = accessToken;
          data.refresh_token = refreshToken;
          const currentDate = new Date();
          const refreshTokenExp = DateUtil.addDays(
            currentDate,
            process.env.REFRESH_TOKEN_EXPIRATION,
          );

          try {
            await t.none(
              'UPDATE app_user SET refresh_token = $1, refresh_token_exp_date = $3 WHERE app_user.id = $2',
              [encryptedAccessToken, activeUser.id, refreshTokenExp],
            );
            // addMinute change to addDays on prod
            data.refresh_token_exp_date = refreshTokenExp;

            return res.status(200).json({
              status: 'OK',
              data,
              message: 'Berhasil masuk',
            });
          } catch (err) {
            return next(err);
          }
        } else {
          return res.status(401).json({
            status: 'Unauthorized',
            message: 'Password salah',
          });
        }
      } catch (err) {
        if (err instanceof QueryResultError) {
          try {
            const allUser = await db.one(
              'SELECT * FROM app_user WHERE username = $1',
              req.body.username,
            );

            if (allUser) {
              return res.status(401).json({
                status: 'Unauthorized',
                message: 'Status user belum aktif. Hubungi developer',
              });
            }
          } catch (error) {
            return res.status(401).json({
              status: 'Unauthorized',
              message: 'Username ini tidak ditemukan',
            });
          }
        }
        return next(err);
      }
    });
  },
  //  async authenticate(req, res, next) {
  //    try {
  //      const activeUser = await db.one('SELECT * FROM app_user WHERE username = $1 AND is_active = true', req.body.username);
  //
  //      if (activeUser && bcrypt.compareSync(req.body.password, activeUser.password)) {
  //        const accessToken = jwt.sign({ sub: activeUser.id, role: activeUser.role }, config.secret, { expiresIn: config.accessTokenExpiration });
  //        const refreshToken = jwt.sign({ sub: activeUser.id, role: activeUser.role }, config.secret, { expiresIn: config.refreshTokenExpiration });
  //        const { password, ...userWithoutPassword } = activeUser;
  //        const data = userWithoutPassword;
  //        data.access_token = accessToken;
  //        data.refresh_token = refreshToken;
  //
  //        return res.status(200)
  //          .json({
  //            status: 'OK',
  //            data,
  //            message: 'Berhasil masuk'
  //          });
  //      } else {
  //        return res.status(401)
  //          .json({
  //            status: 'Unauthorized',
  //            message: 'Password salah'
  //          });
  //      }
  //    } catch (err) {
  //      if (err instanceof QueryResultError) {
  //        try {
  //          const allUser = await db.one('SELECT * FROM app_user WHERE username = $1', req.body.username);
  //
  //          if (allUser) {
  //            return res.status(401)
  //              .json({
  //                status: 'Unauthorized',
  //                message: 'Status user belum aktif. Hubungi developer'
  //              });
  //          }
  //        } catch (error) {
  //          return res.status(404)
  //            .json({
  //              status: 'Not Found',
  //              message: 'Username ini tidak ditemukan'
  //            });
  //        }
  //      }
  //      return next(err);
  //    }
  //  },
  async changeActiveStatus(req, res, next) {
    const isActive = req.query.is_active;
    const userId = req.params.id;
    try {
      await db.none('UPDATE app_user SET is_active = $1:raw WHERE id = $2', [
        isActive,
        userId,
      ]);
      return res.status(200).json({
        status: 'OK',
        message: `Status user berhasil dirubah menjadi ${isActive}`,
      });
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      await db.none(user.update, [
        req.params.id,
        req.body.username,
        req.body.first_name,
        req.body.last_name,
        req.body.role,
        req.body.is_active,
      ]);
      return res.status(200).json({
        status: 'OK',
        message: `User id: ${req.params.id} berhasil dirubah`,
      });
    } catch (err) {
      return next(err);
    }
  },

  async refreshToken(req, res) {
    try {
      const authedUser = await db.one(
        'SELECT * FROM app_user WHERE username = $1 AND is_active = true AND refresh_token IS NOT NULL',
        req.body.username,
      );

      const currentDate = new Date();
      const secret = process.env.SECRET;
      if (
        authedUser &&
        bcrypt.compareSync(req.body.refresh_token, authedUser.refresh_token)
      ) {
        // refresh token is authorized ask for new access token
        const accessToken = jwt.sign(
          { sub: authedUser.id, role: authedUser.role },
          secret,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
        );
        const data = { access_token: accessToken };

        if (authedUser && currentDate > authedUser.refresh_token_exp_date) {
          res.status(401).json({
            status: 'Unauthorized',
            message: 'Refresh token is expired',
          });
        } else {
          res.status(200).json({
            status: 'OK',
            data,
            message: 'Berhasil generate access token baru',
          });
        }
      } else {
        res.status(401).json({
          status: 'Unauthorized',
          message: 'Refresh token is invalid',
        });
      }
    } catch (error) {
      res.status(401).json({
        status: 'Unauthorized',
        message: 'Refresh token is not registered',
      });
    }
  },
  async signOut(req, res, next) {
    try {
      await db.none(
        'UPDATE app_user SET refresh_token = NULL, refresh_token_exp_date = NULL WHERE app_user.username = $1',
        [req.body.username],
      );
      return res.status(200).json({
        status: 'OK',
        message: 'User berhasil di-signout',
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default User;
