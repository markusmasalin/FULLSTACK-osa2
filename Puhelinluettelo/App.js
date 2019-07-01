import React, { useState, useEffect } from 'react'
import nameService from './services/names'
import Persons from './components/Persons'

const ErrorNotification = ({ message }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    border: 'solid',
    padding: '10px',
    margin: '10px'
  }
  if (message === '') {
    return null
  }
  if (message === null) {
    return null
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const SuccessNotification = ({ message }) => {
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    border: 'solid',
    padding: '10px',
    margin: '10px'
  }
  if (message === '') {
    return null
  }
  
  return (
    <div style={successStyle}>
      {message}
    </div>
  )
}


const Filter = ({filterInput, handleFilter}) => {
    console.log(filterInput)    
    return (
        <form>
            rajaa näytettäviä
            <input 
                value={filterInput}
                onChange={handleFilter}
            />
        </form>
    )
}

const PersonForm = ({addName, newName, handleNameChange, newNumber, handleNumberChange}) => {
    return (
        <form onSubmit={addName}>
            <div>
                <h3>lisää nimiä</h3>
                nimi: <input 
                value={newName}
                onChange={handleNameChange}
                />
            </div>
            <div>numero: <input 
                value={newNumber}
                onChange={handleNumberChange}
                />
            </div>
            <div>
                <button type="submit">lisää</button>
            </div>
        </form>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber] = useState('')
    const [filterInput, setNewFilterInput] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
      nameService
      .getAll().then(initialNames => {
        setPersons(initialNames)
      })
    }, [])
    console.log('render', persons.length, 'persons')

    const namesToShow = persons.filter(person => person.name.toLowerCase().includes(filterInput.toLowerCase()))
    
    const deleteNumber = (event) => {
      event.preventDefault()
      const deleteId = parseInt(event.target.value)
      const findDeletedId = persons.filter(name => name.id === deleteId)
      if (window.confirm("Delete " + findDeletedId[0].name)) { 
        nameService
            .deleteName(deleteId).then(response => {
              setPersons(persons.filter(name => name.id !== deleteId))
              setSuccessMessage(
                `${findDeletedId[0].name} is deleted from the phonebook`
              )
              setTimeout(() => {
                setSuccessMessage(null)
              }, 5000)
            })
            .catch(err => {
              setErrorMessage(
                `Name ${deleteId.name} was already removed from server`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
      }
    }
    const addName = (event) => {
        event.preventDefault()
        const nameObject = {
            name: newName,
            number: newNumber
        }
        var found=false;
        persons.forEach(function(item){
            if(item.name === nameObject.name){
                found=true;               
            }
        })
        if (found===true){
          if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
            const updatedPerson = persons.find(n => n.name === newName)  
            const changedNumber = { ...updatedPerson, number: nameObject.number}   
              nameService
                .update(updatedPerson.id, changedNumber).then(returnedName => {
                  setSuccessMessage(
                    `The number of '${updatedPerson.name}' is updated to server`
                  )
                  setTimeout(() => {
                    setSuccessMessage(null)
                  }, 5000)
                  setPersons(persons.map(name => name.id !== updatedPerson.id ? name : returnedName))      
                })
                .catch(error => {
                  setErrorMessage(
                    `Name '${updatedPerson.name}' was already removed from phonebook`
                  )
                  setTimeout(() => {
                    setErrorMessage(null)
                  }, 5000)
                  setPersons(persons.filter(n => n.id !== updatedPerson.id))
                })
          }
        } 
        if (found===false){
            setPersons(persons.concat(nameObject))
            setNewNumber('')
            setNewName('')
        
            nameService
              .create(nameObject).then(returnedName => {
                  setPersons(persons.concat(returnedName))
                  setNewName('')
                  setSuccessMessage(
                    `${nameObject.name} is added to phonebook`
                  )
                  setTimeout(() => {
                    setErrorMessage(null)
                  }, 5000)
                })
              .catch(error => {
                setErrorMessage(
                  `Ups, something went wrong. Try to add  '${nameObject.name}' again`
                )
                setTimeout(() => {
                  setErrorMessage(null)
                }, 5000)
              })
          }
    }

    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }
    const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
    }
    const handleFilter = (event) => {
        console.log(event.target.value)
        setNewFilterInput(event.target.value)
    }
    
    return (
        <div>
        <h2>Puhelinluettelo</h2> 
        <ErrorNotification message={errorMessage} />
        <SuccessNotification message={successMessage} />

        <Filter filterInput={filterInput} handleFilter={handleFilter}/>  
        <PersonForm 
            addName={addName}
            newName={newName}
            handleNameChange={handleNameChange}
            newNumber={newNumber}
            handleNumberChange={handleNumberChange}    
            />
        <h3>Numerot</h3>
        <Persons rows={namesToShow} deleteNumber={deleteNumber}   />      
        </div>
    )
}
export default App


