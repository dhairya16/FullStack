interface BmiValues {
  height: number
  weight: number
}

export const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments')
  if (args.length > 4) throw new Error('Too many arguments')

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    }
  } else {
    throw new Error('Provided values were not numbers!')
  }
}

export const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / (height / 100) ** 2

  if (bmi < 18.5) {
    return `Underweight`
  } else if (bmi < 25) {
    return `Normal range`
  } else if (bmi < 30) {
    return `Overweight`
  } else if (bmi < 35) {
    return `Obesity Class I`
  } else if (bmi < 40) {
    return `Obesity Class II`
  } else {
    return `Obesity Class III`
  }
}

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv)
    console.log(calculateBmi(height, weight))
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
    } else {
      console.log('unknown error')
    }
  }
}
