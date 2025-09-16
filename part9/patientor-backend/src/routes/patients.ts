import express from 'express';
import { Response } from 'express';
import {
  getNonSensitivePatients,
  addPatient,
} from '../services/patientsService';
import { NonSensitivePatent, Patient } from '../types';
import toNewPatientEntry from '../utils';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatent[]>) => {
  return res.json(getNonSensitivePatients());
});

router.post('/', (req, res) => {
  const newPatientEntry = toNewPatientEntry(req.body);

  const addedPatient: Patient = addPatient(newPatientEntry);
  res.json(addedPatient);
});

export default router;
