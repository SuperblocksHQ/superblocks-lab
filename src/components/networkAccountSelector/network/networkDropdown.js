import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from '../style.less';

export default class NetworkDropdown extends Component {
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
