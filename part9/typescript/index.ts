import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    const h = Number(height);
    const w = Number(weight);

    const range = calculateBmi(h, w);

    res.status(200).json({
      weight: h,
      height: w,
      bmi: range,
    });
  } else {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every((n) => typeof n === 'number' && !isNaN(n)) ||
    typeof target !== 'number' ||
    isNaN(target)
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const ans = calculateExercises(daily_exercises as number[], target);
  return res.json(ans);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
