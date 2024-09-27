import { Router } from 'express';

export interface API {
  router: Router;
  register(): Router;
}