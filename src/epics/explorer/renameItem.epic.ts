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

import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { explorerActions, panesActions } from '../../actions';
import { projectSelectors } from '../../selectors';
import { projectService } from '../../services';
import { empty } from 'rxjs';

export const renameItemEpic: Epic = (action$, state$) => action$.pipe(
    ofType(explorerActions.RENAME_ITEM),
    switchMap((action) => {
        const project = projectSelectors.getProject(state$.value);
        const explorerState = state$.value.explorer;

        if (explorerState.itemNameValidation.isValid) {
            return projectService.putProjectById(project.id, {
                name: project.name,
                description: project.description,
                files: explorerState.tree
            })
            .pipe(
                map(() => explorerActions.renameItemSuccess(action.data.id, action.data.name)),
                catchError(() => [ explorerActions.renameItemFail(explorerState.itemNameValidation.itemId, explorerState.itemNameValidation.oldName) ])
            );
        } else {
            alert('A file or folder with the same name already exists at this location. Please choose a different name.');
            return empty();
        }
    })
);