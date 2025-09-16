import { v1 as uuid } from 'uuid';
import data from '../../data/patients';
import { Patient, NonSensitivePatent, NewPatientEntry } from '../types';

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

export const addPatient = (newPatient: NewPatientEntry): Patient => {
  const newPatientEntry: Patient = {
    id: uuid(),
    ...newPatient,
  };

  data.push(newPatientEntry);
  return newPatientEntry;
};
