import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownContainer } from '../dropdown';
import style from './style.less';
import AccountSelector from './account/accountSelector';
import {
    IconDeployGreen,
    IconDropdown,
} from '../icons';

class NetworkDropdown extends Component {
    render() {
        var networks;
        const project = this.props.router.control.getActiveProject();
        if (!project) {
            // Setup default stub network just for show. This is due to the fact that atm networks are
            // actually dependent on the project.
            networks = [
                {
                    getName: () => 'browser',
                },
            ];
        } else {
            const environmentsItem = project.getHiddenItem('environments');
            networks = environmentsItem.getChildren();
        }

        const renderedNetworks = networks.map(network => {
            const cls = {};
            cls[style.networkLink] = true;
            cls[style.capitalize] = true;
            if (network.getName() == this.props.networkSelected)
                cls[style.networkLinkChosen] = true;
            return (
                <div
                    key={network.getName()}
                    onClick={e => {
                        e.preventDefault();
                        this.props.onNetworkSelected(network.getName());
                    }}
                    className={classnames(cls)}
                >
                    {network.getName()}
                </div>
            );
        });
        return (
            <div className={style.networks}>
                <div className={style.title}>Select a Network</div>
                {renderedNetworks}
            </div>
        );
    }
}

NetworkDropdown.propTypes = {
    networkSelected: PropTypes.string.isRequired,
    onNetworkSelected: PropTypes.func.isRequired,
};

// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
//
class NetworkSelector extends Component {
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

export default class NetworkAcccountSelector extends Component {
    render() {
        let { ...props } = this.props;
        return (
            <div className={style.container}>
                <IconDeployGreen />
                <NetworkSelector {...props} />
                <div className={style.separator} />
                <AccountSelector {...props} />
            </div>
        );
    }
}
