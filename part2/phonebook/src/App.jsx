import { useState } from "react";
import Filter from "./components/Filter";
import ContactForm from "./components/ContactForm";
import ContactsList from './components/ContactsList'
const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);    //persons is the main array in which all names are stored

  const [newName, setNewName] = useState('');
  //newName is the name that is being added using the input value of the form
  //setNewName is the function that changes the value of newName
  const [newNumber, setNewNumber] = useState('');

  const [newFilter, setFilter] = useState('');

  const addPerson = (e) => {
    e.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    if (persons.some(person => person.name.toLowerCase() === nameObject.name.toLowerCase())) {
      alert(`${nameObject.name} is already added to phonebook`);
      return
    }

    if (persons.some(person => person.number === nameObject.number)) {
      alert(`${nameObject.number} is already added to the phonebook`);
      return
    }

    if (nameObject.name === '') {
      alert('Name cannot be empty');
      return
    }

    setPersons(persons.concat(nameObject));
    console.log(persons);
    setNewName('');
    setNewNumber('');

  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()));

  return (
    <div>
      <h1>PHONEBOOK</h1>
      <Filter value={newFilter} onChange={e => setFilter(e.target.value)} />
      <ContactForm newName={newName} onNameChange={e => setNewName(e.target.value)} 
                   newNumber={newNumber} onNumberChange={e => setNewNumber(e.target.value)} 
                   onSubmit={addPerson} />
      <ContactsList contacts={filteredPersons}/>
    </div>
  )
}

export default App;
