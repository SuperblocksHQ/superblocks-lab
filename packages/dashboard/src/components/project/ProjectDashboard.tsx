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
import Loadable from 'react-loadable';
import Topbar from '../topbar';
import style from './style.less';
import { EmptyLoading } from '../common';
import { SideMenu, SideMenuItem, SideMenuFooter } from '../sideMenu';
import { IconConfigure, IconPlay } from '../common/icons';
import { IProject } from '../../models';
import { ProjectDashboardSection } from './ProjectDashboardSection.enum';

const ProjectSettingsDetails = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectSettingsDetails" */'../project/settings/projectSettingsDetails'),
    loading: EmptyLoading,
});

const BuildList = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectBuild" */'../project/builds/BuildList'),
    loading: EmptyLoading,
});

interface IProps {
    location: any;
    match: any;
    section: ProjectDashboardSection;
    loadProject: (projectId: string) => void;
    isProjectLoading: boolean;
}

export default class ProjectDashboard extends Component<IProps> {

    componentDidMount() {
        const { match, loadProject } = this.props;

        console.log(this.props);
        loadProject(match.params.projectId);
    }

    renderSection() {
        const { section, location, match } = this.props;

        console.log(section);

        switch (section) {
            case ProjectDashboardSection.BUILD:
                return <BuildList location match />;
            case ProjectDashboardSection.SETTINGS:
                return <ProjectSettingsDetails {...this.props}/>;
            default:
                return <BuildList location match />;
        }
    }

    render() {
        const { isProjectLoading } = this.props;
        const { pathname } = this.props.location;

        console.log('here');
        return (
            <div className={style.projectDashboard}>
                <React.Fragment>
                    <Topbar />
                    <div className={style.content}>
                        <SideMenu>
                            <SideMenuItem
                                    icon={<IconPlay />}
                                    title='Builds'
                                    active={pathname.includes('builds')}
                                    linkTo={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/builds`}
                            />
                            <SideMenuFooter>
                                <SideMenuItem
                                    icon={<IconConfigure />}
                                    title='Project Settings'
                                    active={pathname.includes('settings')}
                                    linkTo={`/${this.props.match.params.organizationId}/projects/${this.props.match.params.projectId}/settings/details`}
                                />
                            </SideMenuFooter>

                        </SideMenu>
                        <div className={style.pageContent}>
                            {this.renderSection()}
                        </div>
                    </div>
                </React.Fragment>
            </div>
        );
    }
}
