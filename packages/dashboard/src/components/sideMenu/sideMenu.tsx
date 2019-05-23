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
import { IconChevronLeft } from '../common/icons';

interface IState {
    collapsed: boolean;
}

interface IProps {
    className?: string | object;
    toggleSidemenuInLocalStorage: (collapsed: boolean) => void;
}

export default class SideMenu extends Component<IProps, IState> {
    state = {
        collapsed: localStorage.getItem('sideMenuCollapsed') === 'true' ? true : false
    };

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.props.toggleSidemenuInLocalStorage(window.innerWidth < 1100);

            this.setState({
                collapsed: window.innerWidth < 1100
            });
        }, false);
    }

    toggleExpanded = () => {
        this.props.toggleSidemenuInLocalStorage(!this.state.collapsed);

        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        const { className } = this.props;
        const { collapsed } = this.state;

        return (
            <div className={classNames([style.sideMenuContainer, collapsed ? style.collapsed : null, className])}>
                <div className={style.sideMenuInner}>
                    {this.props.children}
                </div>
                <div className={classNames([style.collapseSidebar, style.item])} onClick={this.toggleExpanded}>
                    <IconChevronLeft />
                </div>
            </div>
        );
    }
}
