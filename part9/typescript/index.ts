import express from 'express'
import { calculateBmi } from './bmiCalculator'

const app = express()

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => {
  console.log(req.query)
  const { height, weight } = req.query

  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    const h = Number(height)
    const w = Number(weight)

    const range = calculateBmi(h, w)

    res.status(200).json({
      weight: h,
      height: w,
      bmi: range,
    })
  } else {
    res.status(400).json({ error: 'malformatted parameters' })
  }
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
