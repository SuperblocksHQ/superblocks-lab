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
import Proptypes from 'prop-types';
import classNames from 'classnames';
import style from './style.less';
import ModalHeader from '../modal/modalHeader';
import PreferenceCategory from './preferenceCategory';
import ChainPreferences from './sections/chainPreferences';
import {
    IconChain
} from '../icons';

export default class PreferencesModal extends Component {

    state = {
        categorySelectedId: 0,
        tempPreferences: {
            chain: {}
        }
    }

    onCategorySelected(id) {
        this.setState({
            categorySelectedId: id
        })
    }

    onCloseClickHandle = () => {
        this.props.onCloseClick();
    }

    onSavePreferences = () => {
        this.props.savePreferences(this.state.tempPreferences);
        this.onCloseClickHandle();
    }

    chainPreferenceChangeHandle = ({ gasLimit, gasPrice }) => {
        this.setState({
            ...this.state,
            tempPreferences: {
                ...this.state.tempPreferences,
                chain: {
                    gasLimit: gasLimit ? gasLimit : this.state.tempPreferences.chain.gasLimit,
                    gasPrice: gasPrice ? gasPrice : this.state.tempPreferences.chain.gasPrice
                }
            }
        });
    }

    render() {
        let { categories } = this.props;
        categories = [{ id: 0, name: "Chain", icon: <IconChain /> }]
        let { categorySelectedId } = this.state;
        return(
            <div className={classNames([style.prefrerencesModal, "modal"])}>
                <div className={style.container}>
                    <ModalHeader
                        title="Preferences"
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div className={style.area}>
                        <div className={style.categoriesArea}>
                            <div className={style.categoriesContainer}>
                                <ul>
                                    {
                                        categories.map(category =>
                                            <li key={category.id} className={categorySelectedId == category.id ? style.selected : null}>
                                                <PreferenceCategory
                                                    icon={category.icon}
                                                    title={category.name}
                                                    onCategorySelected={() => this.onCategorySelected(category.id)}/>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className={style.preferencesArea}>
                            <ChainPreferences
                                onPreferenceChange={this.chainPreferenceChangeHandle}/>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <div className={style.buttonsContainer}>
                            <button onClick={this.onCloseClickHandle} className="btn2 noBg mr-2">Cancel</button>
                            <button onClick={this.onSavePreferences} className="btn2">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PreferencesModal.proptypes = {
    onCloseClick: Proptypes.func.isRequired,
    savePreferences: Proptypes.func.isRequired
}
