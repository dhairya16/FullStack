import express from 'express';
import { Request, Response, NextFunction } from 'express';
import {
  getNonSensitivePatients,
  addPatient,
} from '../services/patientsService';
import { NewPatientEntry, NonSensitivePatent, Patient } from '../types';
import NewEntrySchema from '../utils';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatent[]>) => {
  return res.json(getNonSensitivePatients());
});

export const newPatientParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const addedPatient: Patient = addPatient(req.body);
    res.json(addedPatient);
  }
);

router.use(errorMiddleware);

export default router;
