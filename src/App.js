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
      // null - no search performed
      response: null,
      // true - pending response started
      // false - pending response stopped
      bIsPendingResponse: false
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
      this.setState({
        ...this.state,
        bIsPendingResponse: true
      })
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
            bIsPendingResponse: false
          }))
    }
  }
  // Decide what message will be shown to user 
  // after and while performing the search
  getSearchOutput() {
    const { response, bIsPendingResponse } = this.state
    // Loading animation while pending response
    if (bIsPendingResponse) {
      return <div className="searchOutputContainer">
        <div className="ldsDualRing"></div>
      </div>
    }
    // Initial state
    if (response === null) {
      return <div className="searchOutputContainer">
        <p>type name of character and press Enter</p>
      </div>
    }
    // If character is not found by name
    else if (response.size === 0) {
      return <div className="searchOutputContainer">
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
