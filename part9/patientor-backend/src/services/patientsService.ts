import data from '../../data/patients';
import { Patient, NonSensitivePatent } from '../types';

export const getAllPatients = (): Patient[] => {
  return data;
};

export const getNonSensitivePatients = (): NonSensitivePatent[] => {
  return data.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};
