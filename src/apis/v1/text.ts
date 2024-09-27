import { Router } from 'express';
import { Request, Response, NextFunction } from "express";
import { API } from '../../types/api';
import { CreateNewTextController } from '../../controllers/text/createNewText';
import { createNewTextValidator } from '../../validations/text/createNewText';

export class TextAPI implements API {
  router: Router;

  constructor() {
    this.router = Router();
  }

  register(): Router {
    this.router.post('/', [createNewTextValidator], (req: Request, res: Response, next: NextFunction) => new CreateNewTextController(req.body).execute(req, res, next));

    return this.router;
  }
}