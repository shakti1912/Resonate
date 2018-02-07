import React from 'react';
import {Redirect} from 'react-router-dom';
import AllParties from '../AllParties'
import {isLoggedIn, getLoggedInUser} from "../../util";
import Party from "../Party";

class MyProfile extends React.PureComponent {
    render() {

        return (
            <div>

                <div style={{
                    height: 120,
                    width: 120,
                    borderRadius: '50%',
                    lineHeight: '120px',
                    fontSize: '50px',
                    backgroundColor: 'orange',
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    margin: 'auto',
                    marginTop: 50
                }}>
                    {getLoggedInUser().email.charAt(0).toUpperCase()}
                </div>

                <div style={{color: 'white'}}>Logged in as {getLoggedInUser().email}</div>

                <Party/>

                <AllParties
                    mine={true}
                />

            </div>

        );

    }
}

export default MyProfile;
