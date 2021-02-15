import "./styles/App.css";
import React, { useState } from "react";
import { List, Set } from "immutable"
import CharacterInfo from "../src/components/CharacterInfo"
import "./styles/Components.css"
import warningImg from "../src/components/utils"
import { ResponseData } from "../src/components/CharacterInfo"
import { debounce } from "lodash"


// Main app structure
const App = () => {
  const [input, setInput] = useState<string>("")
  const [response, setResponse] = useState<null | List<ResponseData>>(null)
  const [bIsPendingResponse, setIsPendingResponse] = useState<boolean>(false)
  const [setOfActivatedCards, setSetOfActivatedCards] = useState<Set<string[]>>(Set())
  const [listOfActivatedCards, setListOfActivatedCards] = useState<List<ResponseData>>(List())

  // Either delete or add card when star is clicked
  const setCardAction = (bIsNameContained: boolean, name: string[], id: number) => {
    const responseAsList = response as List<ResponseData>
    const responseData = responseAsList.get(id) as ResponseData
    // If name is contained in setOfActivatedCards, delete card's name and data
    if (bIsNameContained) {
      // Delete name from the set
      setSetOfActivatedCards(setOfActivatedCards.delete(name))
      // Delete data by id from the list
      setListOfActivatedCards(listOfActivatedCards.delete(id))
    }
    // If name is not contained on setOfActivatedCards, add card's name and data
    else {
      // Add name to set
      setSetOfActivatedCards(setOfActivatedCards.add(name))
      // Add data to list
      setListOfActivatedCards(listOfActivatedCards.concat(responseData))
    }
  }

  const onInputChange = ({ currentTarget: { value } }: React.FormEvent<HTMLInputElement>) => {
    // Input of user
    debouncedFetchName(value);
    // Update input field value to present new input 
    setInput(value)
    setIsPendingResponse(true)
  }

  const fetchName = (name: string) => {
    if (name.length < 1)
      return;
    // Find character by input of user from API
    fetch("https://swapi.dev/api/people/?search=" + name)
      .then(Response => {
        return Response.json()
      })
      .then(jsonData => {
        // Update state with found characters
        setResponse(List(jsonData.results))
        setIsPendingResponse(false)
      }
      )
  }
  const debouncedFetchName = debounce(fetchName, 500)
  // Decide what message will be shown to user
  // after and while performing the search
  const getSearchOutput = () => {
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
            setStarAction={setCardAction}
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
          setStarAction={setCardAction}
          setOfActivatedCards={setOfActivatedCards}
          // Id of card in listOfActivatedCards 
          id={listOfActivatedCards.indexOf(info)}
        />)
    }
  }

  return <div className="App">
    <h1>Star Wars Characters</h1>
    <input className="mainInput"
      value={input}
      onChange={onInputChange}
      placeholder={"type name of character..."}
    />
    {getSearchOutput()}
  </div>
}

export default App;