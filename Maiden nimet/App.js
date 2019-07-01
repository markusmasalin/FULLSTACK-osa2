import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Button = (props) => {
  return (
  <button onClick={props.handleButton}>{props.text}</button>
  )
}
const ShowFilteredCountries = ({filterCountries, setNewFilterInput, setWeather, weather}) => {
  
    const filteredRows = () => filterCountries.map(country => {
      const newFilter = ({country}) => {   
          console.log(country.name)
          setNewFilterInput(country.name)
      }
      return(
      <div key={country.name}> {country.name}  
        <Button handleButton={() => newFilter({country}) } text="show" />
      </div> 
      )
    }
    )
    const filterOneCountry = () => filterCountries.map(country => {
      useEffect(() => {
        axios
          .get('http://api.apixu.com/v1/current.json?key=2d2e72e1553e43268c4190746192505&q=' + country.name)
          .then(response => {
            console.log('promise fulfilled 2')
            setWeather(response.data.current)
            console.log(response.data.current)
           
            
          })
      }, [])
      return(      
        <div key= {country.name}>
          <div> 
            <h2> {country.name}</h2> 
            <p> capital {country.capital} </p>
            <p> population: {country.population} </p>
            <div> <h3>Languages:</h3>
              {country.languages.map(lang => (
                <li key={lang.name}>{lang.name}</li>
              ))}
            </div>
              <img src={country.flag} width={300} height={150} mode='fit'/>
          </div>
          <div >
            <h2>Weather in {country.name}</h2>
          </div>
          <div key={weather.temp_c}> 
              <p> Temperature:  {weather.temp_c} Celsius</p>
           
          </div>
          <div>
          { weather.condition && <img src={weather.condition.icon} /> }
              
          </div>

          <div key={weather.wind_kph}>
                <p>Wind: {weather.wind_kph} </p>
          </div>
          
        </div>
          
      )
      }  
    )
    if (filterCountries.length === 1){ 
      return (
        <div>  {filterOneCountry()}</div>
      )      
    } if (filterCountries.length > 1 && filterCountries.length < 10) {     
      return (
        <div> {filteredRows()}</div>
      )
    } if (filterCountries.length >= 10) {     
      return (
        <div> Too many matches. Please, spesify another filter</div>
      )
    } else {
      return (
        <div>
        Sorry, no matches. Try another filter. 
      </div>
      )
    }
}
const Filter = ({filterInput, handleFilter}) => {
    console.log(filterInput)
    return (
        <form>
            find countries
            <input 
            value={filterInput}
            onChange={handleFilter}
            />
        </form>
    )
}
const App = () => {
    const [country, setCountry] = useState([])
    const [weather, setWeather] = useState({})
    const [filterInput, setNewFilterInput] = useState('')  
    useEffect(() => {
      console.log('effect')
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(response => {
          console.log('promise fulfilled')
          setCountry(response.data)
          console.log(response.data)
        })
    }, [])
    console.log('render', country.length, 'country')  
    const filterCountries = country.filter(maa => maa.name.toLowerCase().includes(filterInput.toLowerCase()))
    const handleFilter = (event) => {
        console.log(event.target.value)
        setNewFilterInput(event.target.value)
    }       
    return (
        <div>        
        <Filter filterInput={filterInput} handleFilter={handleFilter}/>
        <ShowFilteredCountries 
          filterCountries={filterCountries} 
          country={country} 
          setNewFilterInput={setNewFilterInput} 
          setWeather={setWeather}
          weather={weather}
          />
        </div>
    )
}
export default App