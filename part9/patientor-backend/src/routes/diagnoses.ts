import express from 'express';
import { Response } from 'express';
import diagnosesService from '../services/diagnosesService';
import { Diagnosis } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  return res.json(diagnosesService.getAllDiagnoses());
});

export default router;
