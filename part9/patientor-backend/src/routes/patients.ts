import express from 'express';
import { Response } from 'express';
import { getNonSensitivePatients } from '../services/patientsService';
import { NonSensitivePatent } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatent[]>) => {
  return res.json(getNonSensitivePatients());
});

export default router;
