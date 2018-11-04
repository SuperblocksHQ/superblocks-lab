// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Units from 'ethereumjs-units';
import style from './style.less';
import * as validations from '../../../../validations';
import TextInput from '../../../textInput';

export default class ChainPreferences extends Component {

    state = {
        errorGasLimit: null,
        errorGasPrice: null,
        tempGasLimit: this.props.chainPreferences.gasLimit,
        tempGasPrice: this.props.chainPreferences.gasPrice
    }

    onChange = (e, key) => {
        var value = e.target.value;
        var gasLimitValue = this.state.tempGasLimit;
        var gasPriceValue = this.state.tempGasPrice;
        if (key === "gasLimit") {
            gasLimitValue = Number(value);
        } else if (key === "gasPrice") {
            gasPriceValue = Number(value);
        }

        const errorGasLimit = validations.validateGasLimit(gasLimitValue);
        const errorGasPrice = validations.validateGasPrice(gasPriceValue);
        this.setState({ errorGasLimit, errorGasPrice });

        if (!errorGasLimit && !errorGasPrice) {
            this.props.onPreferenceChange({
                gasLimit: gasLimitValue,
                gasPrice: gasPriceValue
            });
        }

        // To make sure we update the input tip correctly
        this.setState({
            tempGasLimit: gasLimitValue,
            tempGasPrice: gasPriceValue
        });
    }

    render() {
        const {
            chainPreferences: { gasPrice },
            chainPreferences: { gasLimit }
        } = this.props;
        const {
            errorGasLimit,
            errorGasPrice,
            tempGasLimit,
            tempGasPrice
        } = this.state;

        const gasLimitGwei = Units.convert(tempGasLimit, 'wei', 'gwei');
        const gasPriceGwei = Units.convert(tempGasPrice, 'wei', 'gwei');

        return (
            <div>
                <h2>Chain Preferences</h2>
                <div className={style.form}>
                    <form action="">
                        <div className={style.field}>
                            <TextInput
                                id="gasLimit"
                                type="number"
                                label="Gas Limit"
                                error={errorGasLimit}
                                onChangeText={(e)=>{this.onChange(e, 'gasLimit')}}
                                defaultValue={gasLimit}
                                tip={gasLimitGwei + ' Gwei'}
                            />
                            <div className={style.note}>Maximum amount of gas available to each block and transaction. <b>Leave blank for default.</b></div>
                            <TextInput
                                id="gasPrice"
                                type="number"
                                label="Gas Price"
                                error={errorGasPrice}
                                onChangeText={(e)=>{this.onChange(e, 'gasPrice')}}
                                defaultValue={gasPrice}
                                tip={gasPriceGwei + ' Gwei'}
                            />
                            <div className={style.note}>The price of each unit of gas, in WEI. <b>Leave blank for default.</b></div>
                        </div>
                    </form>
                </div>
            </div>

        )
    }
}

ChainPreferences.propTypes = {
    onPreferenceChange: PropTypes.func.isRequired
}


