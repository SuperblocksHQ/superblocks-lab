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
import moment from 'moment';
import { IconBranch, IconCommit, IconClock, IconCalendar } from '../../../icons';
import { BuildStatus } from './BuildStatus';

interface IProps {
    build: any;
}

export default class BuildListItem extends Component<IProps> {

    render() {
        const { build } = this.props;

        return (
            <React.Fragment>
                <td>
                    <BuildStatus status={build.status} />
                </td>
                <td>#{build.buildNumber}</td>
                <td>
                    <div>
                    <IconBranch />
                    {build.branch}
                    </div>
                </td>
                <td>
                    <img src={build.commit.ownerAvatar} />
                        <span>
                            {build.commit.description}
                        </span>
                        <span>
                            <IconCommit />
                            {build.commit.hash}
                        </span>
                </td>
                <td className={style[`status-${build.status}`]}>
                    <span>
                        <IconClock />
                        {build.buildTime}
                    </span>
                    <span>
                        <IconCalendar />
                        {moment.utc(build.commit.timestamp).fromNow()}
                    </span>
                </td>
            </React.Fragment>
        );
    }
}
