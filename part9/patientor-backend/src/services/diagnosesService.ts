import data from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getAllDiagnoses = (): Diagnosis[] => {
  return data;
};

export default { getAllDiagnoses };
