import React from 'react';
import {Link} from 'react-router-dom';

class AllPartiesPage extends React.PureComponent {

    constructor(props) {

        super(props);

        this.state = {
            parties: []
        };

        this.getAllParties = () => {

            const address = this.props.mine ? `${window.__server__}/api/me/parties` : `${window.__server__}/api/parties`;

            console.log(address);

            fetch(address, {
                headers: {
                    'Authorization': 'JWT ' + JSON.parse(localStorage.auth).token
                }
            })
                .then((response) => {

                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                    }

                    return response.json();

                })
                .then((json) => {

                    if (json.parties) {

                        const parties = json.parties;

                        this.setState({
                            parties: parties
                        });

                    }

                });

        };

        this.getAllParties();

    }

    render() {

        return (

            <div className="App" style={{display: 'flex', flexDirection: 'column'}}>

                {this.state.parties &&
                <div>

                    <div className={'Header'}><h1>{this.props.mine ? 'My parties' : 'All Parties'}</h1></div>

                    <div className={'List'}>
                        {this.state.parties.map(party => (

                            <Link to={`/party/${party._id['$oid']}`}>
                                <div key={party._id['$oid']}>
                                    {party.name}
                                </div>
                            </Link>

                        ))
                        }

                    </div>

                </div>
                }

            </div>

        );
    }
}

export default AllPartiesPage;
