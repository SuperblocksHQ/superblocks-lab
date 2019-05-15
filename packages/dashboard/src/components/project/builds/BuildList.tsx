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
import { BreadCrumbs, StyledButton } from '../../common';
import { SetupBuild } from './SetupBuild';
import OnlyIf from '../../common/onlyIf';
import { IProject, IPipeline, IOrganization, StyledButtonType, VcsType } from '../../../models';
import { EmptyRepository } from './emptyRepository';
import classNames from 'classnames';

interface IProps {
    location: any;
    match: any;
    project: IProject;
    organization: IOrganization;
    projectPipelineList: IPipeline[];
    getProjectPipelineList: (projectId: string) => void;
    isProjectPipelineListLoading: boolean;
    disconnectProjectRepository: (projectId: string) => void;
}

export default class BuildList extends Component<IProps> {

    componentWillMount() {
        const { projectId } = this.props.match.params;
        this.props.getProjectPipelineList(projectId);
    }

    decorateVcsUrl(vcsUrl: string) {
        return vcsUrl && vcsUrl.replace('https://github.com/', '').replace('.git', '');
    }

    render() {
        const { project, organization, projectPipelineList, isProjectPipelineListLoading, disconnectProjectRepository } = this.props;
        const { organizationId, projectId } = this.props.match.params;

        return (
            <React.Fragment>
                <BreadCrumbs>
                    <Link to={`/${this.props.match.params.organizationId}`}>{organization.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>{project.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}>Builds</Link>
                </BreadCrumbs>

                <div className={style.buildsTitle}>
                    <h1>Builds</h1>
                    <div className={style.disconnectBtn}>
                        <StyledButton type={StyledButtonType.Danger} text={'Disconnect repository'} onClick={() => disconnectProjectRepository(project.id)} />
                    </div>
                </div>
                <a className={style.repoLink} href={project.vcsUrl} target='_blank' rel='noopener noreferrer'>
                    <IconGithub className={classNames([style.colorGrey, style.githubLogo])} />
                    <span>
                        {this.decorateVcsUrl(project.vcsUrl)}
                    </span>
                    <IconExternalLink width='10px' height='10px' />
                </a>
                <div className={style.hr}></div>

                <OnlyIf test={projectPipelineList.length > 0}>
                    <div className={style.buildList}>
                        <div className={classNames([style.buildItem, style.header])}>
                            <div className={style.singleCell}>Status</div>
                            <div className={style.singleCell}>Build #</div>
                            <div className={style.singleCell}>Branch</div>
                            <div className={style.singleCell}>Commit</div>
                            <div className={style.singleCell}></div>
                        </div>
                        { projectPipelineList.map((pipeline, index) =>
                            <div className={style.buildItem} key={index}>
                                <BuildListItem pipeline={pipeline} projectId={projectId} organizationId={organizationId} />
                            </div>
                        )}
                    </div>
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
