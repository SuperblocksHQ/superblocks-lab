import React, { Component } from 'react';
import style from './style.less';
import AccountSelector from './account/accountSelector';
import NetworkSelector from './network/networkSelector';
import {
    IconDeployGreen,
} from '../icons';

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
