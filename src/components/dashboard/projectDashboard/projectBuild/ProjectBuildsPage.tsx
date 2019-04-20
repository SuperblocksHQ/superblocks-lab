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
import { IconGithub, IconExternalLink } from '../../../icons';
import BuildListItem from './BuildListItem';

interface IProps {
    location: any;
    match: any;
}

export default class ProjectBuildsPage extends Component<IProps> {
    render() {
        // TODO: Get project from cloud
        const project = {
            repository: {
                fullName: 'superblocks/ethereum-react',
                link: 'https://github.com/SuperblocksHQ/superblocks-lab'
            },
            builds: [
                {
                    status: 1,
                    buildNumber: 1,
                    branch: 'master',
                    buildTime: '00:02:56',
                    commit: {
                        ownerAvatar: 'https://avatars0.githubusercontent.com/u/17637244?v=4&s=24',
                        description: 'Update contract constructor',
                        hash: '26ed941',
                        timestamp: '2019-04-15T12:47:45.090Z'
                    }
                },
                {
                    status: 0,
                    buildNumber: 2,
                    branch: 'my-branch',
                    buildTime: '00:02:56',
                    commit: {
                        ownerAvatar: 'https://avatars3.githubusercontent.com/u/7814134?v=4&s=24',
                        description: 'Mierda',
                        hash: 'df24adf',
                        timestamp: '2019-04-15T12:47:45.090Z'
                    }
                },
                {
                    status: -1,
                    buildNumber: 3,
                    branch: 'fork-branch',
                    buildTime: '00:02:56',
                    commit: {
                        ownerAvatar: 'https://avatars0.githubusercontent.com/u/17637244?v=4&s=24',
                        description: 'Initial commit',
                        hash: 'gf245df',
                        timestamp: '2019-04-15T12:47:45.090Z'
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <BreadCrumbs>
                    <Link to={`/dashboard`}>Organization Name</Link>
                    <Link to='./'>Project Name</Link>
                    <Link to={window.location.pathname}>Build</Link>
                </BreadCrumbs>

                <h1>Builds</h1>
                <a className={style.repoLink} href={project.repository.link} target='_blank' rel='noopener noreferrer'>
                    <IconGithub size='xs' className={style.colorGrey} />
                    <span>
                        {project.repository.fullName}
                    </span>
                    <IconExternalLink width='10px' height='10px' />
                </a>
                <div className={style.hr}></div>
                <table className={style.buildList}>
                    <tr>
                        <th>Status</th>
                        <th>Build #</th>
                        <th>Branch</th>
                        <th>Commit</th>
                    </tr>

                    { project.builds.map(build =>
                        <tr className={style.buildItem}>
                            <BuildListItem build={build} key={build.commit.hash} />
                        </tr>
                    )}
                </table>
            </React.Fragment>
        );
    }
}
