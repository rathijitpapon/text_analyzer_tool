import { Router } from 'express';
import { API } from '../../types/api';
import { TextAPI } from './text';
import { AuthAPI } from './auth';

export class V1API implements API {
  router: Router;

  constructor() {
    this.router = Router();
  }

  register(): Router {
    this.router.use('/texts', new TextAPI().register());
    this.router.use('/auth', new AuthAPI().register());

    return this.router;
  }
}