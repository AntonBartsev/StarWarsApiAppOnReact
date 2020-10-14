import React from "react";
import { List } from "immutable"
import CharacterInfo from "./CharacterInfo"

const inputStyle = {
    width: "200px",
    borderRadius: "10px",
    WebkitBoxShadow: "0px 6px 24px 0px rgba(0,0,0,0.08)",
    MozBoxShadow: "0px 6px 24px 0px rgba(0,0,0,0.08)",
    boxShadow: "0px 6px 24px 0px rgba(0,0,0,0.08)",
    border: "none",
    width: "480px",
    paddingLeft: "12px",
    paddingRight: "12px",
    paddingTop: "12px",
    paddingBottom: "12px"
}

class MainDiv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            response: List([])
        }
        this.onInputChange = this.onInputChange.bind(this);
        this.fetchName = this.fetchName.bind(this)
    }
    onInputChange(event) {
        const text = event.target.value;
        this.setState({
            ...this.state,
            input: text
        })
    }

    fetchName(event) {
        const name = event.target.value;
        if (event.key === "Enter") {
            fetch("https://swapi.dev/api/people/?search=" + name)
                .then(Response => {
                    return Response.json()
                })
                .then(jsonData =>
                    this.setState({
                        ...this.state,
                        response: List(jsonData.results)
                    }))
        }
        else return {

        }
    }


    render() {
        return <div>
            <h1>Star Wars Characters</h1>
            <input
                style={inputStyle}
                value={this.state.input}
                onChange={this.onInputChange}
                placeholder={"type name of character..."}
                onKeyDown={this.fetchName} />
            {this.state.response
                .map(info =>
                    <CharacterInfo
                        key={this.state.response.indexOf(info)}
                        info={JSON.stringify(this.state.response.get
                            (this.state.response.indexOf(info)))}
                    />)
            }
        </div>

    }
}
export default MainDiv;