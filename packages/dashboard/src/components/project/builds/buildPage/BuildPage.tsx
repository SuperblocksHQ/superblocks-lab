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
import { IconBranch, IconCommit } from '../../../common/icons';
import { BuildStatus } from '../BuildStatus';
import moment from 'moment';
import BuildConsole from './BuildConsole';
import classNames from 'classnames';
import { IProject, IOrganization, IJob } from '../../../../models';
import OnlyIf from '../../../common/onlyIf';

interface IProps {
    build: any;
    location: any;
    match: any;
    project: IProject;
    job: IJob;
    organization: IOrganization;
    jobId: string;
    getJob: (jobId: string) => void;
}

export default class BuildPage extends Component<IProps> {

    componentWillMount() {
        const { match, getJob } = this.props;
        getJob(match.params.buildId);
    }
    render() {
        const { project, job, organization } = this.props;

        return (
            <OnlyIf test={organization}>
                <div className={style.buildPage}>
                    <BreadCrumbs>
                        <Link to={`/${this.props.match.params.organizationId}`}>{organization.name}</Link>
                        <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>{project.name}</Link>
                        <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>Builds</Link>
                        <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds/${this.props.match.params.buildId}`}>
                            #{this.props.match.params.buildId}
                        </Link>
                    </BreadCrumbs>

                    { job &&
                        <React.Fragment>
                            <div className={style.title}>
                                <BuildStatus status={job.status} />
                                <h1><span>{`Build #${job.id} - `}</span>{job.commit.description}</h1>
                            </div>

                            <p className={classNames([style.subtitle, style.flexVerticalCenter])}>
                                {
                                    `Triggered ${moment.utc(job.createdAt).fromNow()} by `
                                }
                                <img src={job.commit.ownerAvatar} />
                                <span className={style.ownerName}>{job.commit.ownerName}</span>
                                <span>
                                    <IconBranch />
                                    <a href={job.commit.branchUrl} className={classNames([style.linkPrimary, style['ml-1']])} target='_blank' rel='noopener noreferrer'>
                                        {job.commit.branch}
                                    </a>
                                </span>
                                <span>
                                    <IconCommit />
                                    <a href={job.commit.commitUrl} className={classNames([style.linkPrimary, style['ml-1']])} target='_blank' rel='noopener noreferrer'>
                                        {job.commit.hash}
                                    </a>
                                </span>
                            </p>

                            <div className={style.tabNavigation}>
                                <a href='#' className={style.tabItem}>Logs</a>
                            </div>
                            <div className={style.hr}></div>

                            <h2>Compile and Test</h2>
                            <p className={style['mb-4']}>
                                <span><b>Total duration:</b> {job.duration}</span>
                                <span className={style['ml-3']}><b>Queued:</b> 00:01 waiting</span>
                            </p>

                            <BuildConsole consoleOutput={job.log} />
                        </React.Fragment>
                    }
                </div>
            </OnlyIf>
        );
    }
}
