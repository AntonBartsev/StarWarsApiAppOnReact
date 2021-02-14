import "./styles/App.css";
import React from "react";
import { List, Set } from "immutable"
import CharacterInfo from "../src/components/CharacterInfo"
import "./styles/Components.css"
import warningImg from "../src/components/utils"
import { ResponseData } from "../src/components/CharacterInfo"
import { debounce } from "lodash"



type AppState = {
  // Input field value
  input: string,
  // List of characters found by name
  // null - no search performed
  response: null | List<ResponseData>,
  // true - pending response started
  // false - pending response stopped
  bIsPendingResponse: boolean,
  // Set of names of cards with activated star
  setOfActivatedCards: Set<string[]>,
  // list of data of cards with activated star
  listOfActivatedCards: List<ResponseData>
}


// Main app structure
class App extends React.Component<{}, AppState> {
  private debouncedFetchName: Function

  constructor(props: AppState) {
    super(props);
    this.state = {
      input: "",
      response: null,
      bIsPendingResponse: false,
      setOfActivatedCards: Set(),
      listOfActivatedCards: List()
    }
    this.onInputChange = this.onInputChange.bind(this);
    this.getSearchOutput = this.getSearchOutput.bind(this);
    this.debouncedFetchName = debounce(this.fetchName, 500);
    this.setCardAction = this.setCardAction.bind(this)
  }

  // Either delete or add card when star is clicked
  setCardAction(bIsNameContained: boolean, name: string[], id: number) {
    const { setOfActivatedCards, response, listOfActivatedCards } = this.state;
    const responseAsList = response as List<ResponseData>
    const responseData = responseAsList.get(id) as ResponseData
    // If name is contained in setOfActivatedCards, delete card's name and data
    if (bIsNameContained) {
      this.setState({
        ...this.state,
        // Delete name from the set
        setOfActivatedCards: setOfActivatedCards.delete(name),
        // Delete data by id from the list
        listOfActivatedCards: listOfActivatedCards.delete(id)
      })
    }
    // If name is not contained on setOfActivatedCards, add card's name and data
    else {
      this.setState({
        ...this.state,
        // Add name to set
        setOfActivatedCards: setOfActivatedCards.add(name),
        // Add data to list
        listOfActivatedCards: listOfActivatedCards.concat(responseData)
      })
    }
  }

  onInputChange({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) {
    // Input of user
    this.debouncedFetchName(value);
    // Update input field value to present new input 
    this.setState({
      ...this.state,
      input: value,
      bIsPendingResponse: true
    })
  }

  fetchName(name: string) {
    if (name.length < 1)
      return;
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

  // Decide what message will be shown to user
  // after and while performing the search
  getSearchOutput() {
    const { bIsPendingResponse, response, input, setOfActivatedCards, listOfActivatedCards } = this.state
    const responseAsList = response as List<ResponseData>
    // Loading animation while pending response
    if (bIsPendingResponse && input.length > 0) {
      return <div className="searchOutputContainer">
        <div className="ldsDualRing"></div>
      </div>
    }
    // Initial state
    if ((response === null || input.length === 0) && listOfActivatedCards.size === 0) {
      return <div className="searchOutputContainer">
        <p>type name of Star Wars character</p>
      </div>
    }
    // If character is not found by name
    else if (responseAsList.size === 0 && input.length > 0) {
      return <div className="searchOutputContainer">
        {warningImg}
        <p className="warning">nothing found</p>
      </div>
    }
    // If character is found by name
    else if (responseAsList.size > 0 && input.length > 0) {
      return responseAsList
        .map((info: ResponseData, key: number) =>
          <CharacterInfo
            key={key}
            info={info}
            setStarAction={this.setCardAction}
            setOfActivatedCards={setOfActivatedCards}
            // Id of card in responseAsList
            id={responseAsList.indexOf(info)}
          />)
    }
    // If any card has activated star
    else if (input.length === 0 && listOfActivatedCards.size > 0) {
      return listOfActivatedCards.map((info: ResponseData, key: number) =>
        <CharacterInfo
          key={key}
          info={info}
          setStarAction={this.setCardAction}
          setOfActivatedCards={setOfActivatedCards}
          // Id of card in listOfActivatedCards 
          id={listOfActivatedCards.indexOf(info)}
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
      />
      {this.getSearchOutput()}
    </div>
  }
}

export default App;