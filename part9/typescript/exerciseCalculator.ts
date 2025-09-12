import { isNotNumber } from './utils'

interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

interface ExerciseValues {
  target: number
  days: number[]
}

const parseArguments = (args: string[]): ExerciseValues => {
  let target = 0

  if (!isNaN(Number(args[2]))) {
    target = Number(args[2])
  } else {
    throw new Error('Provided values were not numbers!')
  }

  const exerciseHours = process.argv.slice(3).map((h) => {
    if (isNotNumber(h)) {
      throw new Error('Provided values were not numbers!')
    }
    return Number(h)
  })

  return {
    target,
    days: exerciseHours,
  }
}

const calculateExercises = (
  exerciseHours: number[],
  target: number
): Result => {
  const periodLength = exerciseHours.length

  let trainingDays: number = 0
  let sum: number = 0

  for (let i = 0; i < periodLength; i++) {
    sum += exerciseHours[i]
    if (exerciseHours[i] > 0) trainingDays += 1
  }

  const avg: number = sum / periodLength

  let rating: number = 1
  if (avg >= target) rating = 3
  else if (avg < target && avg > Math.min(...exerciseHours)) rating = 2

  let ratingDescription: string = 'too bad'
  if (rating === 2) ratingDescription = 'not too bad but could be better'
  else if (rating === 3) ratingDescription = 'great'

  return {
    periodLength,
    trainingDays,
    success: avg > target,
    rating,
    ratingDescription,
    target,
    average: avg,
  }
}

try {
  const { target, days } = parseArguments(process.argv)
  console.log(calculateExercises(days, target))
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message)
  }
}
