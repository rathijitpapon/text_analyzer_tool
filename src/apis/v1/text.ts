import { Router } from 'express';
import { Request, Response, NextFunction } from "express";
import { API } from '../../types/api';
import { CreateNewTextController } from '../../controllers/text/createNewText';
import { UpdateTextController } from '../../controllers/text/updateText';
import { DeleteTextController } from '../../controllers/text/deleteText';
import { GetTextController } from '../../controllers/text/getText';
import { GetAllTextsController } from '../../controllers/text/getAllText';
import { createNewTextValidator } from '../../validations/text/createNewText';
import { updateTextValidator } from '../../validations/text/updateText';
import { deleteTextValidator } from '../../validations/text/deleteText';
import { getTextValidator } from '../../validations/text/getText';
import { getAllTextsValidator } from '../../validations/text/getAllTexts';
import {
  getTextResponseSchema,
  getWordCountResponseSchema,
  getCharacterCountResponseSchema,
  getSentenceCountResponseSchema,
  getParagraphCountResponseSchema,
  getLongestParagraphWordsResponseSchema,
} from '../../validations/text/getText';

export class TextAPI implements API {
  router: Router;

  constructor() {
    this.router = Router();
  }

  register(): Router {
    this.router.post('/', [createNewTextValidator], (req: Request, res: Response, next: NextFunction) => new CreateNewTextController(req.body).execute(req, res, next));
    this.router.get('/', (req: Request, res: Response, next: NextFunction) => new GetAllTextsController().execute(req, res, next));
    this.router.patch('/:id', [updateTextValidator], (req: Request, res: Response, next: NextFunction) => new UpdateTextController(req.body).execute(req, res, next));
    this.router.delete('/:id', [deleteTextValidator], (req: Request, res: Response, next: NextFunction) => new DeleteTextController(req.body).execute(req, res, next));
    this.router.get('/:id', [getTextValidator], (req: Request, res: Response, next: NextFunction) => new GetTextController(req.body, getTextResponseSchema).execute(req, res, next));

    this.router.get('/:id/word-count', [getTextValidator], (req: Request, res: Response, next: NextFunction) => new GetTextController(req.body, getWordCountResponseSchema).execute(req, res, next));
    this.router.get('/:id/character-count', [getTextValidator], (req: Request, res: Response, next: NextFunction) => new GetTextController(req.body, getCharacterCountResponseSchema).execute(req, res, next));
    this.router.get('/:id/sentence-count', [getTextValidator], (req: Request, res: Response, next: NextFunction) => new GetTextController(req.body, getSentenceCountResponseSchema).execute(req, res, next));
    this.router.get('/:id/paragraph-count', [getTextValidator], (req: Request, res: Response, next: NextFunction) => new GetTextController(req.body, getParagraphCountResponseSchema).execute(req, res, next));
    this.router.get('/:id/longest-paragraph-words', [getTextValidator], (req: Request, res: Response, next: NextFunction) => new GetTextController(req.body, getLongestParagraphWordsResponseSchema).execute(req, res, next));

    return this.router;
  }
}