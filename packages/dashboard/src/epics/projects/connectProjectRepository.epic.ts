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

import { of, empty } from 'rxjs';
import { switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import { projectService } from '../../services/project.service';
import { checkInstallations, redirectToGithub } from '../utils/github.utils';

export const connectProjectRepository: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.CONNECT_PROJECT_REPOSITORY),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        return checkInstallations(state.user.profile.githubId, action.data.repositoryId)
        .pipe(
            switchMap((res) => {
                if (res.id) {
                    return projectService.createRepositoryConfigById(action.data.id, { vcsUrl: action.data.vcsUrl, vcsType: action.data.vcsType })
                        .pipe(
                            switchMap(() => {
                                return [projectsActions.connectProjectRepositorySuccess(), projectsActions.loadProject(action.data.id)];
                            }),
                            catchError((error) => {
                                console.log('There was an issue connecting the repository: ' + error);
                                return of(projectsActions.connectProjectRepositoryFail(error.message));
                            })
                        );
                } else {
                    redirectToGithub();
                    return empty();
                }
            })
        );

    })
);
