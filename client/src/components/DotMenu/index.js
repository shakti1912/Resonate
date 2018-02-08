import React, {Component} from 'react';
import menu from '../../images/menu.svg';

const styles = {
    "DotMenu-Button": {
        position: 'fixed',
        right: 25,
        bottom: 25,
        backgroundColor: 'orange',
        width: 60,
        height: 60,
        borderRadius: '50%',
        textAlign: 'center',
        lineHeight: '44px',
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    "DotMenu-Image": {
        marginTop: 15,
        height: 30
    }

};

class DotMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        }
    }

    flipVisibility = () => {
        this.setState(prevState => ({visible: !prevState.visible}));
    };

    render() {
        return (
            <div>

                <div style={styles['DotMenu-Button']}
                     onClick={this.flipVisibility}>

                    <img style={styles['DotMenu-Image']}
                         src={menu}/>

                </div>

                <div className={'theMenu ' + (this.state.visible ? 'out' : '')}
                     onClick={this.flipVisibility}/>

            </div>
        );
    }
}

export default DotMenu;
