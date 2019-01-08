import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownContainer } from '../../dropdown';
import style from '../style.less';
import NetworkDropdown from './networkDropdown';
import {
    IconDropdown,
} from '../../icons';

// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
export default class NetworkSelector extends Component {
    constructor(props) {
        super(props);
    }

    onNetworkSelectedHandle = network => {
        const project = this.props.router.control.getActiveProject();
        if (project) {
            project.getHiddenItem('environments').setChosen(network);
            this.props.router.main.redraw(true);
        }
    };

    getNetwork = () => {
        var network = 'browser';
        var endpoint = '';
        const project = this.props.router.control.getActiveProject();
        if (project) {
            network = project.getHiddenItem('environments').getChosen() || network;
            endpoint = project.getEndpoint(network);
        }
        return {network, endpoint};
    };

    render() {
        var {network, endpoint} = this.getNetwork();
        return (
            <DropdownContainer
                dropdownContent={
                    <NetworkDropdown
                        router={this.props.router}
                        networkSelected={network}
                        onNetworkSelected={this.onNetworkSelectedHandle}
                    />
                }
            >
                <div className={classnames([style.selector])}>
                    <div className={style.capitalize} title={endpoint}>
                        {network}
                    </div>
                    <div className={style.dropdownIcon}>
                        <IconDropdown />
                    </div>
                </div>
            </DropdownContainer>
        );
    }
}

NetworkSelector.propTypes = {
    router: PropTypes.object.isRequired
}
