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

import { connect } from 'react-redux';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { userActions, organizationActions, projectsActions } from '../../actions';
import { userSelectors, projectSelectors } from '../../selectors';
import GithubRepositoryList from './GithubRepositoryList';
import { IProject, VcsType } from '../../models';

export { Section } from './GithubRepositoryList';

const mapStateToProps = (state: any) => ({
    repositoryList: userSelectors.getUserRepositoryList(state),
    isRepositoriesLoading: userSelectors.isRepositoriesLoading(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        getUserRepositoryList: () => {
            dispatch(userActions.getUserRepositoryList());
        },
        cancelGetUserRepositoryList: () => {
            dispatch(userActions.cancelGetUserRepositoryList());
        },
        createDefaultOrganization: (organizationName: string, projectName: string, vcsUrl: string, vcsType: VcsType, repositoryId: number) => {
            dispatch(organizationActions.createDefaultOrganization(organizationName, projectName, vcsUrl, vcsType, repositoryId));
        },
        connectProjectRepository: (id: string, vcsUrl: string, vcsType: VcsType, repositoryId: number) => {
            dispatch(projectsActions.connectProjectRepository(id, vcsUrl, vcsType, repositoryId));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GithubRepositoryList);
