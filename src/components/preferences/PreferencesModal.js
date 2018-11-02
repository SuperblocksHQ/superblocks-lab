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

import { h, Component } from 'preact';
import Proptypes from 'prop-types';
import classNames from 'classnames';
import style from './style';
import ModalHeader from '../modal/modalHeader';
import PreferenceCategory from './PreferenceCategory';
import ChainPreferences from './sections/chainPreferences';
import {
    IconChain
} from '../icons';

export default class PreferencesModal extends Component {

    state = {
        categorySelectedId: 0
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
        if (this.state.positiveMatch) {
            this.props.onDeployConfirmed();
        }
    }

    render() {
        let { categories } = this.props;
        categories = [{ id: 0, name: "Chain", icon: <IconChain /> }]
        let { categorySelectedId } = this.state;
        return(
            <div class={classNames([style.prefrerencesModal, "modal"])}>
                <div class={style.container}>
                    <ModalHeader
                        title="Preferences"
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div class={classNames([style.area, style.container])}>
                        <div class={style.categoriesArea}>
                            <ul>
                                {
                                    categories.map(category =>
                                        <li class={categorySelectedId == category.id ? style.selected : null}>
                                            <PreferenceCategory
                                                icon={category.icon}
                                                title={category.name}
                                                onCategorySelected={() => this.onCategorySelected(category.id)}/>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                        <div class={style.preferencesArea}>
                            <ChainPreferences />
                        </div>
                    </div>
                    <div class={style.footer}>
                        <button onClick={this.onCloseClickHandle} class="btn2 noBg mr-2">Cancel</button>
                        <button onClick={this.onSavePreferences} class="btn2">Save</button>
                    </div>
                </div>
            </div>
        );
    }
}

PreferencesModal.proptypes = {
    onCloseClick: Proptypes.func.isRequired
}
