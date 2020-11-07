import React from "react";
import "../styles/Components.css"

// Card with information about found character
class CharacterInfo extends React.Component {
    // Format information fetched from API to present it in the app
    formatInfo(info) {
        // Name of character presented as string
        const nameInfo = "Name: " + info.name + ", "
        // Skin color of character
        const skinColorInfo = "Skin color: " + info.skin_color + ", "
        // Gender of character
        const genderInfo = "Gender: " + info.gender + ", "
        // Mass of character (if mass is unknown, no need to add "kg" clarification)
        const massInfo = "Mass: " + info.mass +
            (info.mass === "unknown" ? "" : "kg")
        // Array of films character participated in
        const filmsOutputArr = []
        for (const film of info.films) {
            // Film as string
            const output = (info.films.indexOf(film) + 1) + ": " + film
            filmsOutputArr.push(output)
        }
        return [nameInfo, skinColorInfo, genderInfo, massInfo, filmsOutputArr]
    }

    render() {
        // Array of information about characters
        const arrayOfInfoPoints = this.formatInfo(this.props.info)
        // Array of films 
        const arrayOfFilms = arrayOfInfoPoints[arrayOfInfoPoints.length - 1]
        // Remove array of films from main info array 
        // to put separately on page
        arrayOfInfoPoints.splice(arrayOfInfoPoints.length - 1, 1)

        return <div class="characterInfoParentDiv">
            {arrayOfInfoPoints.map((el, key) =>
                <div
                    key={key}
                    class="info">
                    {el}
                </div>)
            }
            <h2 class="films">Films: </h2>
            {
                arrayOfFilms.map((el, key) =>
                    <div class="info"
                        key={key}>
                        {el}
                    </div>)
            }
        </div >
    }
}
export default CharacterInfo;