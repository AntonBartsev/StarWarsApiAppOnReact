import React from "react";
// Style for the parent div of info point
const parentDivStyle = {
    position: "relative",
    height: "auto",
    width: "480px",
    top: "50px",
    borderWidth: "0.1px",
    borderRadius: "10px",
    margin: "auto",
    marginBottom: "32px",
    padding: "16px 16px 16px 16px",
    WebkitBoxShadow: "0px 10px 48px 0px rgba(0,0,0,0.08)",
    MozBoxShadow: "0px 10px 48px 0px rgba(0, 0, 0, 0.08)",
    boxShadow: "0px 10px 48px 0px rgba(0,0,0,0.08)"
}
// Style of single info point
const infoStyle = {
    textAlign: "left"
}

// Style of "Films: " heading
const h2Style = {
    textAlign: "left",
    marginBottom: "0px"
}

class CharacterInfo extends React.Component {
    constructor(props) {
        super(props);
        this.formatInfo = this.formatInfo.bind(this)
    }
    // Format information fetched from API to present it in the app
    formatInfo(info) {
        // Character info as object
        const parsedData = JSON.parse(info)
        // Name of character presented as string
        const nameInfo = "Name: " + parsedData.name + ", "
        // Skin color of character
        const skinColorInfo = "Skin color: " + parsedData.skin_color + ", "
        // Gender of character
        const genderInfo = "Gender: " + parsedData.gender + ", "
        // Mass of character (if mass is unknown, no need to add "kg" clarification)
        const massInfo = "Mass: " + parsedData.mass +
            (parsedData.mass === "unknown" ? ", " : "kg, ")
        // Array of films character participated in
        const filmsOutputArr = []
        for (const film of parsedData.films) {
            // Film as string
            const output = (parsedData.films.indexOf(film) + 1) + ": " + film
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
        return <div style={parentDivStyle}>
            {arrayOfInfoPoints.map(el =>
                <div
                    key={arrayOfInfoPoints.indexOf(el)}
                    style={infoStyle}>
                    {el}
                </div>)
            }
            <h2 style={h2Style}>Films: </h2>
            {
                arrayOfFilms.map(el =>
                    <div
                        style={infoStyle}
                        key={arrayOfFilms.indexOf(el)}>
                        {el}
                    </div>)
            }
        </div >
    }
}
export default CharacterInfo;
