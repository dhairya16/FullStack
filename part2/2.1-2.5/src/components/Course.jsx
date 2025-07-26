const Header = (props) => <h1>{props.course}</h1>;

const Content = (props) => (
  <div>
    <Part part={props.parts[0]} />
    <Part part={props.parts[1]} />
    <Part part={props.parts[2]} />
  </div>
);

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = (props) => <p>Number of exercises {props.total}</p>;

const Course = ({ course }) => {
  const totalExercises = course.parts.reduce(
    (prev, part) => prev + part.exercises,
    0
  );

  return (
    <>
      <Header course={course.name} />
      {course.parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      <Total total={totalExercises} />
    </>
  );
};

export default Course;
