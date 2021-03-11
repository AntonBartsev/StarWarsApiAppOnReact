import "../styles/Components.css"
import { List, Map } from "immutable"



// Type of card's data
export interface ResponseData {
    name: string,
    skin_color: string,
    gender: string,
    mass: number | string,
    films: List<string>
}

// Types of props passed from App.tsx
type InfoProps = {
    info: ResponseData,
    setStarAction: (bIsInfoContained: boolean, info: ResponseData) => void
    mapOfActivatedCards: Map<ResponseData["name"], ResponseData>
}

const CharacterInfo = (props: InfoProps) => {
    const { info, mapOfActivatedCards, setStarAction } = props

    // Add or remove card from initial page by clicking on star 
    const toggleStar = () => {
        setStarAction(mapOfActivatedCards.has(info.name), info)
    }

    // Format information fetched from API to present it in the app
    const formatInfo = ({ name, skin_color, gender, mass, films }: ResponseData) => {
        // Skin color of character
        const skinColorInfo = "Skin color: " + skin_color + ", "
        // Gender of character
        const genderInfo = "Gender: " + gender + ", "
        // Mass of character (if mass is unknown, no need to add "kg" clarification)
        const massInfo = "Mass: " + mass +
            (mass === "unknown" ? "" : "kg")
        // format films in the List 
        films.map(film => (films.indexOf(film) + 1) + ": " + film)
        return [name, skinColorInfo, genderInfo, massInfo, films]
    }

    const arrayOfInfoPoints = formatInfo(info)

    // List of films 
    const arrayOfFilms = arrayOfInfoPoints[arrayOfInfoPoints.length - 1] as List<string>

    // Remove array of films from main info List
    // to put separately on page
    arrayOfInfoPoints.splice(arrayOfInfoPoints.length - 1, 1)

    // Name of card
    const nameOfCharacter = arrayOfInfoPoints.splice(0, 1)

    // Change class name of star depending on 
    // existence of card's info in the mapOfActivatedCards
    const starClass =
        props.mapOfActivatedCards.has(info.name)
            ?
            "zmdi zmdi-star zmdi-hc-3x"
            :
            "zmdi zmdi-star-outline zmdi-hc-3x"

    return (<div className="characterInfoParentDiv">
        <h2 className="name">{nameOfCharacter} </h2>
        <div className="star" onMouseDown={toggleStar}>
            <i className={starClass}></i>
        </div>
        {arrayOfInfoPoints.map((el, key) =>
            <div
                key={key}
                className="info">
                {el}
            </div>)
        }
        <h2 className="films">Films: </h2>
        {
            arrayOfFilms.map((el: string, key: number) =>
                <div className="info"
                    key={key}>
                    {el}
                </div>)
        }
    </div >);
}
export default CharacterInfo;