import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import {getLoggedInUser} from "../../util";

class NewParty extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newPartyId: null,
            partyNameInput: ''
        };
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30%'}}>

                <div style={{position: 'relative'}}>

                    <label style={{color: 'white', display: 'block', fontSize: 12, color: 'orange'}}
                           htmlFor="party_name">Party name</label>

                    <input value={this.state.partyNameInput} onChange={(e) => {
                        this.setState({partyNameInput: e.target.value});
                    }} placeholder="My favorite party" type="text" id="party_name" style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '2px solid orange',
                        height: 25,
                        color: 'white',
                        fontSize: 16
                    }}/>

                </div>

                <div style={{marginTop: 15}}>

                    <div style={{
                        display: 'inline-block',
                        padding: '8px 21px',
                        border: '2px solid orange',
                        color: 'orange',
                        fontWeight: 'bold'
                    }} onClick={() => {

                        const parentObj = this;

                        fetch(`${window.__server__}/api/party`, {
                            method: 'post',
                            headers: {
                                'Authorization': 'JWT ' + getLoggedInUser().token
                            },
                            body: JSON.stringify({
                                name: this.state.partyNameInput
                            })
                        })
                            .then(function (response) {
                                if (response.status >= 400) {
                                    throw new Error("Bad response from server");
                                }

                                console.log(response);
                                return response.json();
                            })
                            .then(function (token) {

                                parentObj.setState({
                                    newPartyId: token.response.id
                                });

                                console.log(token);
                            });

                    }}>Add new party
                    </div>

                </div>

                {this.state.newPartyId && <Redirect to={`/party/${this.state.newPartyId}`}/>}
            </div>
        );
    }
}

export default NewParty;
