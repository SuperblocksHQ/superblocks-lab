// Copyright 2019 Superblocks AB
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
import style from './style.less';
import { Link } from 'react-router-dom';
import { BreadCrumbs } from '../../../common';
import { IUser } from '../../../../models';
import ThemeSwitcher from './themeSwitcher';

interface IProps {
    location: any;
    match: any;
    userProfile: IUser;
}

export default class Appearance extends Component<IProps> {
    render() {
        const { userProfile } = this.props;

        return (
            <React.Fragment>
                <BreadCrumbs>
                    <Link to={`/settings/profile`}>Account Settings</Link>
                    <Link to={window.location.pathname}>Appearance</Link>
                </BreadCrumbs>

                <h1>Appearance</h1>
                <div className={style.hr}></div>
                <div className={style.optionBlock}>
                    <ThemeSwitcher />
                </div>
            </React.Fragment>
        );
    }
}
