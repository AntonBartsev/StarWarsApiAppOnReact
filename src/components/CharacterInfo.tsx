import "../styles/Components.css"
import { Set } from "immutable"


// Type of card's data
export interface ResponseData {
    name: string,
    skin_color: string,
    gender: string,
    mass: number | string,
    films: Array<string>
}

// Types of props passed from App.tsx
type InfoProps = {
    info: ResponseData,
    setStarAction: (bIsNameContained: boolean, name: string[], id: number) => void
    setOfActivatedCards: Set<string[]>,
    id: number
}

const CharacterInfo = (props: InfoProps) => {
    const { info, setOfActivatedCards, id, setStarAction } = props

    // Add or remove card from initial page by clicking on star 
    const toggleStar = () => {
        const nameOfCharAsStrArr = nameOfCharacter[0] as string[]
        setStarAction(setOfActivatedCards.contains(nameOfCharAsStrArr), nameOfCharAsStrArr, id)
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
        // Array of films character participated in
        const filmsOutputArr = []
        for (const film of films) {
            // Film as string
            const output = (films.indexOf(film) + 1) + ": " + film
            filmsOutputArr.push(output)
        }
        return [name, skinColorInfo, genderInfo, massInfo, filmsOutputArr]
    }

    const arrayOfInfoPoints = formatInfo(info)

    // Array of films 
    const arrayOfFilms = arrayOfInfoPoints[arrayOfInfoPoints.length - 1] as Array<string>

    // Remove array of films from main info array 
    // to put separately on page
    arrayOfInfoPoints.splice(arrayOfInfoPoints.length - 1, 1)

    // Name of card
    const nameOfCharacter = arrayOfInfoPoints.splice(0, 1)

    // Change class name of star depending on 
    // existence of card's name in the setOfActivatedCards
    const starClass =
        props.setOfActivatedCards.contains(nameOfCharacter[0] as string[])
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