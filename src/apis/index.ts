import httpStatus from 'http-status';
import { Router, Request, Response, NextFunction } from 'express';
import { welcomeMessage } from '../config/constant';
import { API } from '../types/api';

export class APIEndpoints implements API {
  router: Router;

  constructor() {
    this.router = Router();
  }

  register(): Router {
    this.router.get('/health', (req: Request, res: Response, next: NextFunction) => {
        res.status(httpStatus.OK).send('APPLICATION IS LIVE!');
    });
    this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.status(httpStatus.OK).send(welcomeMessage);
    });

    return this.router;
  }
}