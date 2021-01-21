import React from "react";
import "../styles/Components.css"



export interface ResponseData {
    name: string,
    skin_color: string,
    gender: string,
    mass: number | string,
    films: Array<string>
}

type InfoProps = {
    info: ResponseData
}

// Card with information about found character
class CharacterInfo extends React.Component<InfoProps> {
    // Format information fetched from API to present it in the app
    formatInfo( { name, skin_color, gender, mass, films }: ResponseData ) {
        // Skin color of character
        const skinColorInfo = "Skin color: " + skin_color + ", "
        // Gender of character
        const genderInfo = "Gender: " + gender + ", "
        // Mass of character (if mass is unknown, no need to add "kg" clarification)
        const massInfo = "Mass: " + mass +
            ( mass === "unknown" ? "" : "kg" )
        // Array of films character participated in
        const filmsOutputArr = []
        for ( const film of films ) {
            // Film as string
            const output = ( films.indexOf( film ) + 1 ) + ": " + film
            filmsOutputArr.push( output )
        }
        return [name, skinColorInfo, genderInfo, massInfo, filmsOutputArr]
    }
    render() {
        const { info } = this.props
        // Array of information about characters
        const arrayOfInfoPoints = this.formatInfo( info )
        // Array of films 
        const arrayOfFilms = arrayOfInfoPoints[arrayOfInfoPoints.length - 1] as Array<string>
        // Remove array of films from main info array 
        // to put separately on page
        arrayOfInfoPoints.splice( arrayOfInfoPoints.length - 1, 1 )
        const nameOfCharecter = arrayOfInfoPoints.splice( 0, 1 )
        return <div className="characterInfoParentDiv">
            <h2 className="name">{nameOfCharecter} </h2>
            {arrayOfInfoPoints.map( ( el, key ) =>
                <div
                    key={key}
                    className="info">
                    {el}
                </div> )
            }
            <h2 className="films">Films: </h2>
            {
                arrayOfFilms.map( ( el: string, key: number ) =>
                    <div className="info"
                        key={key}>
                        {el}
                    </div> )
            }
        </div >
    }
}
export default CharacterInfo;