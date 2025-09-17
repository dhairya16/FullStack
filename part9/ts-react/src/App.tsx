interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDesc extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartBase, CoursePartDesc {
  // description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBase, CoursePartDesc {
  // description: string;
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartBase, CoursePartDesc {
  requirements: string[]
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;


interface HeaderProps {
  courseName: string
}

const Header = (props: HeaderProps) => {
  return <>
    <h1>{props.courseName}</h1>
  </>
}

interface PartProps {
  data: CoursePart;
}

const Part = ({ data }: PartProps) => {
  switch (data.kind) {
    case 'basic':
      return (
        <div>
          <b>{data.name} {data.exerciseCount}</b>
          <div>{data.description}</div>
        </div>
      )
    case 'group':
      return (
        <div>
          <b>{data.name} {data.exerciseCount}</b>
          <div>project exercises {data.groupProjectCount}</div>
        </div>
      )
    case 'background':
      return (
        <div>
          <b>{data.name} {data.exerciseCount}</b>
          <div>{data.description}</div>
          <div>submit to {data.backgroundMaterial}</div>
        </div>
      )
    case 'special':
      return (
        <div>
          <b>{data.name} {data.exerciseCount}</b>
          <div>{data.description}</div>
          <div>required skills: {data.requirements.join(', ')}</div>
        </div>
      )
  }
}

interface ContentProps {
  courseParts: CoursePart[]
}

const Content = ({ courseParts }: ContentProps) => {
  return <>
    {courseParts.map((cP, idx) => <Part key={idx} data={cP} />)}
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
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;