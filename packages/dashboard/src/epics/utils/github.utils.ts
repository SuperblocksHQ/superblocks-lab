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

import { userService } from '../../services';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * Check if current user provided permission to Github app for selected repository
 * Needed for Github webhooks to work
 * 
 * @param {string} userId - User id of logged in user
 * @param {number} repositoryId - Selected repository id
 * @return {boolean} - true if permission is granted
 */
export function checkInstallations(userId: string, repositoryId: number) {
    return userService.getUserInstallations()
        .pipe(
            switchMap((result) => {
                const installation = result.installations.find((inst: any) => {
                    return inst.account.id === userId;
                });

                if (installation) {
                    return userService.getUserInstallationRepositories(installation.id)
                    .pipe(
                        map((res) => {
                            const repository = res.repositories.find((repo: any) => {
                                return repo.id === repositoryId;
                            });

                            if (repository && repository.owner.id === userId) {
                                return repository;
                            } else {
                                return of(false);
                            }
                        })
                    );
                } else {
                    return of(false);
                }
            })
        );
}

/**
 * Redirects user to Github app configuration, where it's possible to provide permission for selected repository
 * Saves callback url to local storage
 */
export function redirectToGithub() {
    localStorage.setItem('githubRedirect', window.location.pathname);
    window.location.href = 'https://github.com/apps/superblocks-devops';
}
