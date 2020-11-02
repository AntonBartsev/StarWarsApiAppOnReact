import "./Styles.css/App.css";
import React from "react";
import { List } from "immutable"
import CharacterInfo from "./components/CharacterInfo"
import "./Styles.css/Components.css"

function App() {
  // Main app structure
  class MainDiv extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // Input field value
        input: "",
        // List of characters found by name
        response: List([])
      }
      this.onInputChange = this.onInputChange.bind(this);
      this.fetchName = this.fetchName.bind(this)
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
              response: List(jsonData.results)
            }))
      }
    }

    render() {
      const { response } = this.state
      return <div>
        <h1>Star Wars Characters</h1>
        <input className="mainInput"
          value={this.state.input}
          onChange={this.onInputChange}
          placeholder={"type name of character..."}
          onKeyDown={this.fetchName} />
        {response
          .map((info, index) =>
            <CharacterInfo
              key={index}
              info={info}
            />)
        }
      </div>

    }
  }
  return (
    <div className="App">
      <MainDiv />
    </div>
  );
}

export default App;
