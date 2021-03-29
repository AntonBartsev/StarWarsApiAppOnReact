import "./styles/App.css";
import React, { useState } from "react";
import { List, Map } from "immutable"
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
  const [mapOfActivatedCards, setMapOfActivatedCards] = useState<Map<ResponseData["name"], ResponseData>>(Map())

  // Either delete or add card when star is clicked
  const toggleCharacterInfoIsFavorite = (bIsInfoContained: boolean, info: ResponseData) => {
    // If name is contained in setOfActivatedCards, delete card's info
    if (bIsInfoContained) {
      // Delete info from the map
      setMapOfActivatedCards(mapOfActivatedCards.delete(info.name))
    }
    // If name is not contained in mapOfActivatedCards, add card's info
    else {
      // Add info to the map
      setMapOfActivatedCards(mapOfActivatedCards.set(info.name, info))
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
    if ((response === null || input.length === 0) && mapOfActivatedCards.size === 0) {
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
            toggleCharacterInfoIsFavorite={toggleCharacterInfoIsFavorite}
            mapOfActivatedCards={mapOfActivatedCards}
          />)
    }
    // If any card has activated star
    else if (input.length === 0 && mapOfActivatedCards.size > 0) {
      // Immutable Map is not fully optimized for the usage as a child, 
      // so convert it into an Array and take only second element as
      // the first one is the dublicate of the name already contained 
      // in the info
      return mapOfActivatedCards.map((info: ResponseData, key: string) =>
        <CharacterInfo
          key={key}
          info={info}
          toggleCharacterInfoIsFavorite={toggleCharacterInfoIsFavorite}
          mapOfActivatedCards={mapOfActivatedCards}
        />).toArray().map(el => el[1])
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