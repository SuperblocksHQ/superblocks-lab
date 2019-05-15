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
import { LetterAvatar, GenericLoading } from '../common';
import Topbar from '../topbar';
import SideMenu, { SideMenuItem, SideMenuSubHeader, SideMenuFooter } from '../sideMenu';
import ProjectList from '../organization/projectList';
import { Redirect } from 'react-router';
import OnlyIf from '../common/onlyIf';
import { IOrganization, IProject } from '../../models';
import CreateOrganizationModal from '../modals/createOrganizationModal';
import CreateProject from '../organization/createProject';

interface IProps {
    match: any;
    history: any;
    organizationList: [IOrganization];
    selectedOrganization: IOrganization;
    isOrganizationListLoading: boolean;
    loadUserOrganizationList: () => void;
    loadOrganization: (organizationId: string) => void;
    isOrganizationLoading: boolean;
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
        this.props.loadOrganization(organizationId);
    }

    componentWillReceiveProps(nextProps: any) {
        // Update project list when changing organization
        if (this.props.match.params.organizationId !== nextProps.match.params.organizationId) {
            this.props.loadOrganization(nextProps.match.params.organizationId);
            this.props.getProjectList(nextProps.match.params.organizationId);
        }

        // Update organizations when creating a new one
        if (this.props.organizationList.length !== nextProps.organizationList.length) {
            this.props.loadUserOrganizationList();
        }

        // Redirect to new organization when creating one
        if (nextProps.organizationList.length === (this.props.organizationList.length + 1)) {
            const { organizationList } = nextProps;
            this.props.history.push(`/${organizationList[organizationList.length - 1].id}`);
        }
    }

    render() {
        const { projectList, isProjectListLoading, showCreateOrganizationModal, toggleCreateOrganizationModal, organizationList, isOrganizationListLoading, match, selectedOrganization, isOrganizationLoading } = this.props;
        let projectListContent;

        if (isProjectListLoading) {
            projectListContent = <GenericLoading />;
        } else if (projectList.length > 0) {
            projectListContent = <ProjectList
                                    list={projectList}
                                    organizationName={!isOrganizationLoading ? selectedOrganization.name : ''}
                                    organizationId={match.params.organizationId}
                                 />;
        } else {
            projectListContent = <CreateProject organizationId={match.params.organizationId} />;
        }

        return (
            <Fragment>
                <div className={style.dashboard}>
                    <Topbar organizationId={match.params.organizationId} />
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
                        {projectListContent}
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
