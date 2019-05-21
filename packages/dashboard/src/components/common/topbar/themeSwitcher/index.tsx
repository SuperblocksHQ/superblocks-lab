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
import { Tooltip } from '../../tooltip';
import style from './style.less';
import classNames from 'classnames';
import { IconSun, IconMoon } from '../../icons';

export enum Theme {
    Dark = 'dark',
    Light = 'light'
}

interface IState {
    theme: string | null;
}

export class ThemeSwitcher extends Component<{}, IState> {

    state: IState = {
        theme: localStorage.getItem('theme')
    };

    toggleLightMode = () => {
        localStorage.setItem('theme', Theme.Light);
        this.setState({
            theme: Theme.Light
        });
    }

    toggleDarkMode = () => {
        localStorage.setItem('theme', Theme.Dark);
        this.setState({
            theme: Theme.Dark
        });
    }

    render() {
        const { theme } = this.state;

        return (
            <React.Fragment>
            { theme === Theme.Light ?
                    <div onClick={() => this.toggleDarkMode()} className={style.action}>
                        <Tooltip title='Dark mode'>
                            <button className={classNames([style.container, 'btnNoBg'])}>
                                <IconMoon />
                            </button>
                        </Tooltip>
                    </div>
                 :
                    <div onClick={() => this.toggleLightMode()} className={style.action}>
                        <Tooltip title='Light mode'>
                            <button className={classNames([style.container, 'btnNoBg'])}>
                                <IconSun />
                            </button>
                        </Tooltip>
                    </div>
                }
            </React.Fragment>
        );
    }
}
