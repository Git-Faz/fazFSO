import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import ContactForm from "./components/ContactForm";
import ContactsList from './components/ContactsList'
import Contacts from './services/contacts';
import Notification from "./components/Notification";
import './index.css'
const App = () => {

  const [persons, setPersons] = useState([]);    //persons is the main array in which all names are stored
  const [newName, setNewName] = useState('');   //newName is the name that is being added using the input value of the form
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [msgStyle, setMsgStyle] = useState({});

  const clearNotification = () => {
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }

  const successMessage = (message) => {
    setNotification(message);
    setMsgStyle({ color: 'green', backgroundColor: 'lightgreen' });
    clearNotification();
    setNewName('');
    setNewNumber('');
  }

  const errorMessage = (message) => {
    setNotification(message);
    setMsgStyle({ color: 'red', backgroundColor: 'lightcoral' });
    clearNotification();
  }

useEffect(() => {
  Contacts.getAll()
    .then(response => {
    console.log("Fetched contacts:", response);
    if (Array.isArray(response)) {
      setPersons(response);
    } else {
      console.error("Expected array but got:", response);
      setPersons([]);  // fallback to empty array
    }
  });
}, []);


  const addPerson = (e) => {
    e.preventDefault();
    const nameObject = {
      name: newName.trim(),
      number: newNumber,
    }
    if (persons.some(person => person.name.toLowerCase().trim() === nameObject.name.toLowerCase().trim())) {
      const confirmUpdate = window.confirm(`${nameObject.name} is already added to phonebook , do you want to update the number?`);
      if (confirmUpdate) {
        const idToUpdate = persons.find(person => person.name.toLowerCase().trim() === nameObject.name.toLowerCase().trim()).id;
        Contacts
          .update(idToUpdate, nameObject)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== idToUpdate ? person : updatedPerson))
            successMessage(`${nameObject.name} has been updated`)
          })
          .catch(error => {
            console.log(error);
            errorMessage(`${nameObject.name} could not be updated, already removed from server`);
          })
      }
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

    Contacts
      .add(nameObject)
      .then(response => {
        setPersons(persons.concat(response))
        successMessage(`${nameObject.name} has been added`)
        console.log(persons);
      })
      .catch(error => {
        console.log(error);
        errorMessage(`${nameObject.name} could not be added to the server`);
      })     
  }

  const deletePerson = (id) => {
    const selectedPerson = persons.find(person => person.id === id).name;
    const confirmed = window.confirm(`Delete ${selectedPerson} ?`);
    if (!confirmed) {
      return
    }
    Contacts
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
        successMessage(`${selectedPerson} has been deleted`)
      })
      .catch(error => {
        console.log(error);
        errorMessage(`${selectedPerson} could not be deleted`);
      })
  }


  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()));

  return (
    <div>
      <h1>PHONEBOOK</h1>
      <Notification message={notification} style={msgStyle} />
      <Filter value={newFilter} onChange={e => setFilter(e.target.value)} />
      <ContactForm newName={newName} onNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber} onNumberChange={e => setNewNumber(e.target.value)}
        onSubmit={addPerson} />
      <ContactsList contacts={filteredPersons} onDelete={deletePerson} />
    </div>
  )
}

export default App;


