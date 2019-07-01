import React from "react"

const Persons = ({ rows, deleteNumber}) => {
    return rows.map(person => 
        <div key={person.id}>
        {person.name} {person.number}
        <button value={person.id}  onClick={deleteNumber}>delete</button>
        </div>     
    );
} 

export default Persons





