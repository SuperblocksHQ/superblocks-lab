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
import { IconGithub, IconExternalLink } from '../../common/icons';
import BuildListItem from './BuildListItem';
import { BreadCrumbs } from '../../common';
import { SetupBuild } from './SetupBuild';
import OnlyIf from '../../common/onlyIf';
import { IProject, IPipeline, IOrganization } from '../../../models';
import { EmptyRepository } from './emptyRepository';

interface IProps {
    location: any;
    match: any;
    project: IProject;
    organization: IOrganization;
    projectPipelineList: IPipeline[];
    getProjectPipelineList: (projectId: string) => void;
    isProjectPipelineListLoading: boolean;
}

export default class BuildList extends Component<IProps> {

    componentWillMount() {
        const { projectId } = this.props.match.params;
        this.props.getProjectPipelineList(projectId);
    }

    render() {
        const { project, organization, projectPipelineList, isProjectPipelineListLoading } = this.props;
        const { organizationId, projectId } = this.props.match.params;

        return (
            <React.Fragment>
                <BreadCrumbs>
                    <Link to={`/${this.props.match.params.organizationId}`}>{organization.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>{project.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>Builds</Link>
                </BreadCrumbs>

                <OnlyIf test={projectPipelineList.length > 0}>
                    <h1>Builds</h1>
                    <a className={style.repoLink} href={project.vcsUrl} target='_blank' rel='noopener noreferrer'>
                        <IconGithub size='xs' className={style.colorGrey} />
                        <span>
                            {project.vcsUrl}
                        </span>
                        <IconExternalLink width='10px' height='10px' />
                    </a>
                    <div className={style.hr}></div>

                    <table className={style.buildList}>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Build #</th>
                                <th>Branch</th>
                                <th>Commit</th>
                            </tr>
                        </thead>
                        <tbody>
                            { projectPipelineList.map((pipeline, index) =>
                                <tr className={style.buildItem} key={index}>
                                    <BuildListItem pipeline={pipeline} projectId={projectId} organizationId={organizationId} />
                                </tr>
                            )}
                        </tbody>
                    </table>
                </OnlyIf>

                <OnlyIf test={!projectPipelineList.length && !isProjectPipelineListLoading && !project.vcsUrl}>
                    <SetupBuild projectId={projectId} organizationId={organizationId} />
                </OnlyIf>

                <OnlyIf test={!projectPipelineList.length && project.vcsUrl && !isProjectPipelineListLoading}>
                    <EmptyRepository />
                </OnlyIf>
            </React.Fragment>
        );
    }
}
