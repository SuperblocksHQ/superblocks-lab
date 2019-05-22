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

import { of } from 'rxjs';
import { switchMap, withLatestFrom, catchError, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { userActions } from '../../actions';
import { userService } from '../../services';

export const updateUserProfile: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(userActions.UPDATE_USER_PROFILE),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        console.log(state.user);
        console.log(action.data);
        const userToUpdate = state.user.profile;
        userToUpdate.email = action.data.email ? action.data.email : userToUpdate.email;
        userToUpdate.userName = action.data.userName ? action.data.userName : userToUpdate.userName;

        return userService.putUserById(action.data.id, userToUpdate)
            .pipe(
                map(() => userActions.updateUserProfileSuccess(userToUpdate)),
                catchError((error) => {
                    console.log('There was an issue updating the user: ' + error);
                    return of(userActions.updateUserProfile(error.message));
                })
            );

    })
);
