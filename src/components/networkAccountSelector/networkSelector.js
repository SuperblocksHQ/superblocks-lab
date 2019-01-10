import React from 'react';
import classnames from 'classnames';
import { DropdownContainer } from '../dropdown';
import style from './style.less';
import { IconDropdown } from '../icons';
import { NetworksList } from './networksList';

// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
export function NetworkSelector(props) {
    return (
        <DropdownContainer
            dropdownContent={
                <NetworksList
                    selectedNetwork={props.selectedNetwork.name}
                    networks={props.networks}
                    onNetworkSelected={props.onNetworkSelected}
                />
            }
        >
            <div className={classnames([style.selector])}>
                <div className={style.capitalize} title={props.selectedNetwork.endpoint}>
                    {props.selectedNetwork.name}
                </div>
                <div className={style.dropdownIcon}>
                    <IconDropdown />
                </div>
            </div>
        </DropdownContainer>
    );
}
