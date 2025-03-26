const App = () => {
  const course = {
    name: 'Half Stack Development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}></Header>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return (
    <>
      {props.parts.map((part, index) => (
        <Part key={index} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
}

const Part = (props) => {
  return (<p>{props.name} {props.exercises}</p>)
}

const Total = (props) => {
  const [p1, p2, p3] = [props.parts[0].exercises, props.parts[1].exercises, props.parts[2].exercises];
  //let sum = p1+p2+p3;
  return (
    <p>Total Number of Exercises {p1 + p2 + p3}</p>
  )
}

export default App;