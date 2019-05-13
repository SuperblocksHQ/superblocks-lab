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

import React, { Component, Fragment } from 'react';
import style from './style.less';
import { IconConfigure, IconPlusTransparent } from '../common/icons';
import { LetterAvatar } from '../common';
import Topbar from '../topbar';
import { SideMenu, SideMenuItem, SideMenuSubHeader, SideMenuFooter } from '../sideMenu';
import ProjectList from '../organization/projectList';
import { Redirect } from 'react-router';
import OnlyIf from '../common/onlyIf';
import { IOrganization, IProject } from '../../models';
import CreateOrganizationModal from '../modals/createOrganizationModal';
import CreateProject from '../organization/createProject';

interface IProps {
    match: any;
    organizationList: [IOrganization];
    isOrganizationListLoading: boolean;
    loadUserOrganizationList: () => void;
    projectList: IProject[];
    isProjectListLoading: boolean;
    showCreateOrganizationModal: boolean;
    toggleCreateOrganizationModal: () => void;
    getProjectList: (ownerId: string) => void;
    githubLoginAction: () => void;
}

export default class Dashboard extends Component<IProps> {

    componentDidMount() {
        const { organizationId } = this.props.match.params;
        this.props.loadUserOrganizationList();
        this.props.getProjectList(organizationId);
    }

    componentWillReceiveProps(nextProps: any) {
        // Update project list when changing organization
        if (this.props.match.params.organizationId !== nextProps.match.params.organizationId) {
            this.props.getProjectList(nextProps.match.params.organizationId);
        }

        // Update organizations when creating a new one
        if (this.props.organizationList.length !== nextProps.organizationList.length) {
            this.props.loadUserOrganizationList();
        }
    }

    getOrganization() {
        return this.props.organizationList.find((org) =>
            org.id === this.props.match.params.organizationId
        );
    }

    render() {
        const { projectList, isProjectListLoading, showCreateOrganizationModal, toggleCreateOrganizationModal, organizationList, isOrganizationListLoading, match } = this.props;
        const selectedOrganization = this.getOrganization();

        return (
            <Fragment>
                <div className={style.dashboard}>
                    <Topbar />
                    <div className={style.content}>
                        <SideMenu>
                            <SideMenuSubHeader title='My organizations' />
                            { organizationList.map(organization => (
                                <SideMenuItem
                                    key={organization.id}
                                    icon={<LetterAvatar title={organization.name} />}
                                    title={organization.name}
                                    linkTo={`/${organization.id}`}
                                />
                            ))}
                            <SideMenuFooter>
                                <SideMenuItem
                                    icon={<IconPlusTransparent />}
                                    title='New organization'
                                    onClick={toggleCreateOrganizationModal}
                                    linkTo={window.location.pathname}
                                    hideActiveClass={true}
                                />
                                <SideMenuItem
                                    icon={<IconConfigure />}
                                    title='Organization settings'
                                    linkTo={`${match.params.organizationId}/settings/details`}
                                />
                            </SideMenuFooter>
                        </SideMenu>
                        { projectList.length === 0 && !isProjectListLoading ?
                            <CreateProject organizationId={match.params.organizationId} />
                            :
                            <ProjectList
                                list={projectList}
                                organizationName={selectedOrganization ? selectedOrganization.name : 'Organization'}
                                organizationId={match.params.organizationId}
                            />
                        }
                        <OnlyIf test={!isOrganizationListLoading && !organizationList.length}>
                            <Redirect to={'/welcome'} />
                        </OnlyIf>
                    </div>
                </div>
                <OnlyIf test={showCreateOrganizationModal}>
                    <CreateOrganizationModal hideModal={toggleCreateOrganizationModal} />
                </OnlyIf>
                { (organizationList[0] && !match.params.organizationId) &&
                    <Redirect to={organizationList[0].id} />
                }
            </Fragment>
        );
    }
}
