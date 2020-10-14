import React from "react";

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
const infoStyle = {
    textAlign: "left"
}
const h2Style = {
    textAlign: "left",
    marginBottom: "0px"
}

class CharacterInfo extends React.Component {
    constructor(props) {
        super(props);
        this.formatInfo = this.formatInfo.bind(this)
    }
    formatInfo(info) {
        const parsedData = JSON.parse(info)
        const nameInfo = "Name: " + parsedData.name + ", "
        const skinColorInfo = "Skin color: " + parsedData.skin_color + ", "
        const genderInfo = "Gender: " + parsedData.gender + ", "
        const massInfo = "Mass: " + parsedData.mass +
            (parsedData.mass === "unknown" ? ", " : "kg, ")
        const filmsOutputArr = []
        for (const film of parsedData.films) {
            const output = (parsedData.films.indexOf(film) + 1) + ": " + film
            filmsOutputArr.push(output)
        }
        return [nameInfo, skinColorInfo, genderInfo, massInfo, filmsOutputArr]
    }

    render() {
        const arrayOfInfoPoints = this.formatInfo(this.props.info)
        const arrayOfFilms = arrayOfInfoPoints[arrayOfInfoPoints.length - 1]
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
