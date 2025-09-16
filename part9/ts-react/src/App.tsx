const courseParts = [
  {
    name: "Fundamentals",
    exerciseCount: 10
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14
  }
];

interface HeaderProps {
  courseName: string
}

const Header = (props: HeaderProps) => {
  return <>
    <h1>{props.courseName}</h1>
  </>
}

const Content = () => {
  return <>
    <p>
      {courseParts[0].name} {courseParts[0].exerciseCount}
    </p>
    <p>
      {courseParts[1].name} {courseParts[1].exerciseCount}
    </p>
    <p>
      {courseParts[2].name} {courseParts[2].exerciseCount}
    </p>
  </>
}

interface TotalProps {
  totalExercises: number
}

const Total = (props: TotalProps) => {
  return <>
    <p>
      Number of exercises {props.totalExercises}
    </p>
  </>
}

const App = () => {
  const courseName = "Half Stack application development";

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;