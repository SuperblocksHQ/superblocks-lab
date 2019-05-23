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

import { IGithubRepository, IUser } from '../models';

export const userActions = {

    // ---------- CRUD User actions ----------
    UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE',
    updateUserProfile(newUser: Partial<IUser>) {
       return {
            type: userActions.UPDATE_USER_PROFILE,
            data: newUser
       };
    },
    UPDATE_USER_PROFILE_SUCCESS: 'UPDATE_USER_PROFILE_SUCCESS',
    updateUserProfileSuccess(user: IUser) {
       return {
            type: userActions.UPDATE_USER_PROFILE_SUCCESS,
            data: { user }
       };
    },
    UPDATE_USER_PROFILE_FAIL: 'UPDATE_USER_PROFILE_FAIL',
    updateUserProfileFail(error: string) {
       return {
            type: userActions.UPDATE_USER_PROFILE_FAIL,
            data: error
       };
    },


    // ---------- Others ----------
    SET_PROFILE_PICTURE: 'SET_PROFILE_PICTURE',
    setProfilePicture(user: any) {
        return {
            type: userActions.SET_PROFILE_PICTURE,
            data: { user }
        };
    },
    REMOVE_PROFILE_PICTURE: 'REMOVE_PROFILE_PICTURE',
    removeProfilePicture() {
        return {
            type: userActions.REMOVE_PROFILE_PICTURE,
        };
    },
    GET_USER_REPOSITORY_LIST: 'GET_USER_REPOSITORY_LIST',
    getUserRepositoryList() {
        return {
            type: userActions.GET_USER_REPOSITORY_LIST,
        };
    },

    GET_USER_REPOSITORY_LIST_SUCCESS: 'GET_USER_REPOSITORY_LIST_SUCCESS',
    getUserRepositoryListSuccess(githubRepositoryList: IGithubRepository[]) {
        return {
            type: userActions.GET_USER_REPOSITORY_LIST_SUCCESS,
            data: { githubRepositoryList }
        };
    },

    GET_USER_REPOSITORY_LIST_FAIL: 'GET_USER_REPOSITORY_LIST_FAIL',
    getUserRepositoryListFail(error: any) {
        return {
            type: userActions.GET_USER_REPOSITORY_LIST_FAIL,
            error
        };
    },
};
