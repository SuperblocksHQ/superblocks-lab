import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './style.less';

export function NetworksList(props) {
    const renderedNetworks = props.networks.map(network => {
        const cls = {
            [style.networkLinkChosen]: network.name === props.selectedNetwork
        };

        return (
            <div
                key={network.name}
                onClick={e => {
                    e.preventDefault();
                    props.onNetworkSelected(network.name);
                }}
                className={classnames(style.networkLink, style.capitalize, cls)}
            >
                {network.name}
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

NetworksList.propTypes = {
    selectedNetwork: PropTypes.string,
    networks: PropTypes.array.isRequired,
    onNetworkSelected: PropTypes.func.isRequired,
};
