// Copyright 2018 Superblocks AB
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

import { of } from 'rxjs';
import { switchMap, withLatestFrom, catchError, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { organizationActions, projectsActions } from '../../actions';
import { organizationService, projectService } from '../../services';

export const createDefaultOrganization: Epic = (action$, state$) => action$.pipe(
    ofType(organizationActions.CREATE_DEFAULT_ORGANIZATION),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        return organizationService.createOrganization({
            name: action.data.organizationName
        }).pipe(
            switchMap((newOrganization) =>  {
                return projectService.createProject({
                    name: action.data.projectName,
                    ownerId: newOrganization.id,
                    ownerType: 'organization'
                }).pipe(
                    map((newProject) => {
                        window.location.href = `${window.location.origin}/${newOrganization.id}/projects/${newProject.id}/builds`;
                        return projectsActions.createProjectSuccess(newProject);
                    }),
                    catchError((error) => {
                        console.log('There was an issue creating the project: ' + error);
                        return of(projectsActions.createProjectFail(error));
                    })
                );
            }),
            catchError((error) => {
                console.log('There was an issue creating the organization: ' + error);
                return of(organizationActions.createDefaultOrganizationFail(error));
            })
        );
    })
);

