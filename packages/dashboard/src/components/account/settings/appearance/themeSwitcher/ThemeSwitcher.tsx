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
import classNames from 'classnames';
import { Theme } from './';

interface IProps {
    appTheme: Theme;
    changeAppTheme: (appTheme: Theme) => void;
}

export class ThemeSwitcher extends Component<IProps> {

    handleChangeTheme = (theme: Theme) => {
        const { changeAppTheme } = this.props;
        localStorage.setItem('theme', theme);
        changeAppTheme(theme);
    }

    render() {
        const { appTheme } = this.props;

        return (
            <React.Fragment>
                <p>Theme:</p>
                <div className={style.container}>
                    <div onClick={() => this.handleChangeTheme(Theme.Light)} className={style.theme}>
                        <div className={classNames([style.light, appTheme === Theme.Light ? style.active : null])}></div>
                        <p>Light</p>
                    </div>
                    <div onClick={() => this.handleChangeTheme(Theme.Dark)} className={style.theme}>
                        <div className={classNames([style.dark, appTheme === Theme.Dark ? style.active : null])}></div>
                        <p>Dark</p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
