import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {getLoggedInUser, postAuthorized} from "../../util";

const styles = {
    'New-Party-Content': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '30%'
    }
};

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
            <div style={styles['New-Party-Content']}>

                <div style={{position: 'relative'}}>

                    <label style={
                        {
                            display: 'block',
                            fontSize: 12,
                            color: 'orange'
                        }
                    }
                           htmlFor="party_name">
                        Party name
                    </label>

                    <input value={this.state.partyNameInput}
                           onChange={(e) => {
                               this.setState({partyNameInput: e.target.value});
                           }}
                           placeholder="My favorite party"
                           type="text"
                           id="party_name"
                           style={
                               {
                                   backgroundColor: 'transparent',
                                   border: 'none',
                                   borderBottom: '2px solid orange',
                                   height: 25,
                                   color: 'white',
                                   fontSize: 16
                               }
                           }/>

                </div>

                <div style={{marginTop: 15}}>

                    <div style={
                        {
                            display: 'inline-block',
                            padding: '8px 21px',
                            border: '2px solid orange',
                            color: 'orange',
                            fontWeight: 'bold'
                        }
                    }
                         onClick={() => {

                             const parentObj = this;

                             postAuthorized(`${window.__server__}/api/party`, JSON.stringify({
                                 name: this.state.partyNameInput
                             }))
                                 .then(function (token) {

                                     parentObj.setState({
                                         newPartyId: token.response.id
                                     });

                                 });

                         }}>
                        Add new party
                    </div>

                </div>

                {this.state.newPartyId && <Redirect to={`/party/${this.state.newPartyId}`}/>}
            </div>
        );
    }
}

export default NewParty;
