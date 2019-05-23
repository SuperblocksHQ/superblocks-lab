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

import React from 'react';
import style from './style.less';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import OnlyIf from '../common/onlyIf';

interface IProps {
    icon?: JSX.Element;
    title: string;
    onClick?: any;
    active?: boolean;
    hideActiveClass?: boolean;
    linkTo?: string;
    children?: any;
    className?: any;
}

export function SideMenuItem(props: IProps) {
    return (
        <div className={classNames([style.posRelative, props.className, !props.active ? style.flyOut : style.itemWrapper])}>
            <NavLink exact={true} activeClassName={props.hideActiveClass ? null : style.active} to={props.linkTo || ''}>
                <div onClick={props.onClick} className={style.item}>
                    <OnlyIf test={!!props.icon}>
                        <div className={style.iconContainer}>
                            {props.icon}
                        </div>
                    </OnlyIf>
                    <span>
                        {props.title}
                    </span>
                </div>
            </NavLink>
            {props.children}
        </div>
    );
}
