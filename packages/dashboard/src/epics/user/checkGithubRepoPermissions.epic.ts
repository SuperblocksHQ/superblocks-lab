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

import { empty, of} from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { userActions, organizationActions, projectsActions } from '../../actions';
import { userService } from '../../services';
import { VcsType, RepoListScreenType } from '../../models';

/**
 * Redirects user to Github app configuration, where it's possible to provide permission for selected repository
 * Saves callback url to local storage
 */
export function redirectToGithub(ownerId: string, repositoryId: string) {
    localStorage.setItem('githubRedirect', window.location.pathname);
    window.location.href = `${process.env.REACT_APP_GITHUB_APP_URL}/installations/new/permissions?suggested_target_id=${ownerId}&repository_ids[]=${repositoryId}`;
}

/**
 * Check if current user provided permission to our Github app for selected repository.
 * If not, it will automatically redirect the user to Github app permissions page
 * to grant us access to the repo.
 */
export const checkGithubRepoPermissions: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(userActions.CHECK_REPOSITORY_PERMISSIONS),
    withLatestFrom(state$),
    switchMap(([action, ]) => {
        const { repositoryId, repoOwnerId, screenType, projectId } = action.data;
        return userService.getUserInstallations()
            .pipe(
                map((results) => results.installations),
                map((installations) => installations.find((i: any) => i.account.id === repoOwnerId)),
                switchMap((installation) => {
                    if (installation) {
                        return userService.getUserInstallationRepositories(installation.id)
                            .pipe(
                                map((results) => results.repositories),
                                map((repositories) => repositories.find((r: any) => r.id === repositoryId)),
                                switchMap((repo) => {
                                    if (repo) {
                                        if (screenType === RepoListScreenType.Welcome) {
                                            return [userActions.checkRepositoryPermissionsSuccess(), organizationActions.createDefaultOrganization(repo.owner.login, repo.name, repo.clone_url, VcsType.Github)];
                                        } else {
                                            return [userActions.checkRepositoryPermissionsSuccess(), projectsActions.connectProjectRepository(projectId, repo.clone_url, VcsType.Github)];
                                        }
                                    } else {
                                        redirectToGithub(repoOwnerId, repositoryId);
                                        return empty();
                                    }
                                })
                        );
                    } else {
                        redirectToGithub(repoOwnerId, repositoryId);
                        return empty();
                    }
                }),
                catchError((error) => {
                    console.log('There was an issue checking for the repository permissions: ' + error);
                    return of(userActions.checkRepositoryPermissionsFail(error));
                }),
            );
    })
);
