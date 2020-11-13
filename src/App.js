import "./styles/App.css";
import React from "react";
import { List } from "immutable"
import CharacterInfo from "./components/CharacterInfo"
import "./styles/Components.css"
import warningImg from "./components/utils"

// Main app structure
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Input field value
      input: "",
      // List of characters found by name
      response: List([]),
      // Indicates whether character is found or not 
      // null means the initial state of the app
      foundOrSearched: null
    }
    this.onInputChange = this.onInputChange.bind(this);
    this.fetchName = this.fetchName.bind(this)
    this.getSearchOutput = this.getSearchOutput.bind(this)
  }
  onInputChange(event) {
    // Input of user
    const text = event.target.value;
    // Update input field value to present new input 
    this.setState({
      ...this.state,
      input: text
    })
  }
  fetchName(event) {
    // Get input of user        
    const name = event.target.value;
    // Check if user pressed enter
    if (event.key === "Enter") {
      // Find character by input of user from API
      fetch("https://swapi.dev/api/people/?search=" + name)
        .then(Response => {
          return Response.json()
        })
        .then(jsonData =>
          // Update state with found characters
          this.setState({
            ...this.state,
            response: List(jsonData.results),
            // Check if there is any character found and set output prop
            foundOrSearched: List(jsonData.results).size > 0
              ? true : false
          }))
    }
  }
  // Decide what message will be shown to user 
  // after performing the search
  getSearchOutput() {
    const { response, foundOrSearched } = this.state
    // Initial state
    if (foundOrSearched === null) {
      return <div className="outputContainer">
        <p>type name of character and press Enter</p>
      </div>
    }
    // If character is not found by name
    else if (!foundOrSearched) {
      return <div className="outputContainer">
        {warningImg}
        <p className="warning">nothing found</p>
      </div>
    }
    // If character is found by name
    else {
      return response
        .map((info, key) =>
          <CharacterInfo
            key={key}
            info={info}
          />)
    }
  }
  render() {
    return <div className="App">
      <h1>Star Wars Characters</h1>
      <input className="mainInput"
        value={this.state.input}
        onChange={this.onInputChange}
        placeholder={"type name of character..."}
        onKeyDown={this.fetchName} />
      {this.getSearchOutput()}
    </div>
  }
}

export default App;
