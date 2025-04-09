const Title = ({name}) => <h1>{name}</h1>

const Header = ({ heading }) => <h2>{heading}</h2>

const Part = ({ name, exercises }) => <p>{name} - {exercises}</p>

const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <p>Total number of exercises: {totalExercises}</p>
    );
}
const Content = ({ parts }) => {
    return (
        <>
            {parts.map((part) =>(
                <Part key={part.id} name={part.name} exercises={part.exercises}></Part>
            ))}
            <Total parts={parts}></Total>
        </>

    )
}

const Course = ({ courses }) => {
    return (
        <>  
            <Title name={'Web development curriculum'}></Title>
            {courses.map( course => (
                <div key={course.id}>
                    <Header heading={course.name}/>
                    <Content parts = {course.parts}/>
                </div>
            ))}
        </>
    )
}

export default Course;

