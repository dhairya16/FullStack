import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState({ text: null, type: null });

  useEffect(() => {
    phonebookService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const handleInput = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberInput = (event) => {
    setNumber(event.target.value);
  };

  const handleSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Prevent adding duplicate names
    const existingPerson = persons.find((p) => p.name === newName);
    if (existingPerson) {
      if (
        !window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        return;
      }

      phonebookService
        .update(existingPerson.id, {
          ...existingPerson,
          number: number,
        })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id === existingPerson.id ? updatedPerson : p))
          );
        })
        .catch((err) => {
          console.log(err);
          setMessage({
            text: `Information of ${existingPerson.name} has already been removed from server`,
            type: "error",
          });
          setTimeout(() => setMessage({ text: null, type: null }), 5000);
        });

      setNewName("");
      setNumber("");

      return;
    }

    const newPerson = { name: newName, number: number };
    phonebookService
      .create(newPerson)
      .then((personData) => {
        setPersons(persons.concat(personData));
        setMessage({ text: `Added ${newName}`, type: "success" });
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setMessage({ text: error.response.data.error, type: "error" });
      });

    setTimeout(() => setMessage({ text: null, type: null }), 5000);

    setNewName("");
    setNumber("");
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const onDelete = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (!window.confirm(`Delete ${personToDelete.name} ?`)) {
      return;
    }

    phonebookService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.text} type={message.type} />
      <Filter value={searchValue} onChange={handleSearchInput} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        number={number}
        handleInput={handleInput}
        handleNumberInput={handleNumberInput}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onDelete={onDelete} />
    </div>
  );
};

export default App;
