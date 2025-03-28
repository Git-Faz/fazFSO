const Hello = ({name,age}) => {
    const dob = () => new Date().getFullYear()-age;
    
    return(
        <div>
            <p>Hi {name}! You are {age} years old, born in {dob()} </p>
        </div>
    )
}

const MyApp = () => {
    const name = 'faz', age = 20;
    let ms = "High Quality Phone Spare Parts at Affordable Price"
    console.log(ms.toLowerCase());
    return(
        <>
        <Hello name={name} age = {age}/>
        <Hello name="Sam" age = "21"/>
        </>
    )
}

export default MyApp;