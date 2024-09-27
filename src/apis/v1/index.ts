import { Router } from 'express';
import { API } from '../../types/api';
import { TextAPI } from './text';

export class V1API implements API {
  router: Router;

  constructor() {
    this.router = Router();
  }

  register(): Router {
    this.router.use('/texts', new TextAPI().register());

    return this.router;
  }
}