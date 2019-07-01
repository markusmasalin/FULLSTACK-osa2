import React from 'react'

const Header = (props) => {
    return (
    <div>
    <h1>
        {props.courses}
    </h1>
    </div>
    )
}

const Course = ({ courses }) => {
    const { parts } = courses
  
    const rows = () =>
      parts.map(part => <p key={part.id}>{part.name} {" "} {part.exercises}</p>)
    console.log(rows)
  
    const total = () =>
      parts.reduce( (parts, p) => {
        
        console.log('what is happening', parts, p)
        return parts+p.exercises; 
    },0)
      
    
    return (
      <div>
          <Header courses={courses.name} />
          {rows()}
          <p>  Yhteensä {total()} tehtävää  </p> 
           
        </div>
    )
  }

export default Course