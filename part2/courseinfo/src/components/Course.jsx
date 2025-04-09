const Title = ({name}) => {
    return (
        <h1>{name}</h1>
    )
}

const Header = ({ heading }) => {
    return (
        <h2>{heading}</h2>
    )
}

const Part = ({ content }) => {
    return (
        <p>{content.name} - {content.exercises}</p>
    )
}

const Total = ({ parts }) => {
    const totalExe = parts.reduce((acc, part) => {
        console.log(acc, part.exercises);
        return acc + part.exercises},0
    )
    
    return (
        <p>Total Number of exercises - {totalExe}</p>
    )
}
const Content = ({ parts }) => {
    return (
        <>
            {parts.map((part) =>(
                <Part key={part.id} content={part}></Part>
            ))}
            <Total parts={parts}></Total>
        </>

    )
}

const Course = ({ course }) => {
    return (
        <>  
            <Title name={'Web development curriculum'}></Title>
            <Header heading={course.name}></Header>
            <Content parts={course.parts}></Content>
        </>
    )
}

export default Course;
