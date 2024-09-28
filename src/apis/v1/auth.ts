import { Router } from 'express';
import { Request, Response, NextFunction } from "express";
import { API } from '../../types/api';
import passport from 'passport';
import { authenticate } from '../../middlewares/oauth2';
import { GetUserController } from '../../controllers/auth/getUser';

export class AuthAPI implements API {
  router: Router;

  constructor() {
    this.router = Router();
  }
  
  register(): Router {
    this.router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    this.router.get(
      '/google/callback',
      passport.authenticate('google', {
        successRedirect: '/api/v1/auth/protected',
        failureRedirect: '/signin'
      })
    );
    this.router.get('/signout', (req: Request, res: Response, next: NextFunction) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                }
                res.clearCookie('connect.sid');
                res.redirect('/');
            });
        });
    });

    this.router.get('/me', authenticate, (req: Request, res: Response, next: NextFunction) => new GetUserController().execute(req, res, next));

    return this.router;
  }
}