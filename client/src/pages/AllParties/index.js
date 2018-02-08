import React from 'react';
import {Link} from 'react-router-dom';
import {getAuthorizedJson} from "../../util";

class AllPartiesPage extends React.PureComponent {
    constructor(props) {
        super();

        this.state = {
            parties: []
        };

        this.getAllParties = () => {

            const address = props.mine
                ? `${window.__server__}/api/me/parties`
                : `${window.__server__}/api/parties`;

            getAuthorizedJson(address)
                .then((json) => {
                    if (json.parties) {
                        this.setState({
                            parties: json.parties
                        });
                    }
                });

        };

        this.getAllParties();

    }

    render() {

        return (

            <div className="App">

                {
                    this.state.parties
                    && <div>

                        <div className={'Header'}>
                            <h1>{this.props.mine ? 'My parties' : 'All Parties'}</h1>
                        </div>

                        <div className={'List'}>
                            {
                                this.state.parties.map(party => (
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
