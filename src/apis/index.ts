import httpStatus from 'http-status';
import { Router, Request, Response, NextFunction } from 'express';
import { welcomeMessage } from '../config/constant';
import { API } from '../types/api';
import { V1API } from './v1';

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
    this.router.use('/v1', new V1API().register());

    return this.router;
  }
}