import React, {Component} from 'react';
import menu from '../../images/menu.svg';


class DotMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        }
    }

    render() {
        return (
            <div>
                <div style={{
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
                }}
                     onClick={() => {
                         this.setState(prevState => ({visible: !prevState.visible}));
                     }}
                ><img style={{marginTop: 15}} height='30' src={menu}/></div>
                <div className={'theMenu ' + (this.state.visible ? 'out' : '')} onClick={() => {
                    this.setState(prevState => ({visible: !prevState.visible}));
                }}/>
            </div>
        );
    }
}

export default DotMenu;
