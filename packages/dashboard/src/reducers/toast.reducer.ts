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

import { projectsActions, toastActions, organizationActions, userActions } from '../actions';
import { AnyAction } from 'redux';

export const initialState = {
    toasts: new Array<any>()
};

let counter = 0;
export default function toastsReducer(state = initialState, action: AnyAction, rootState: any) {
    function pushToastToState() {
        counter += 1;
        const toast = {
            id: counter,
            type: action.type,
            data: action.data
        };
        return {
            ...state,
            toasts: state.toasts.concat(toast)
        };
    }

    switch (action.type) {
        // Return this when ever we need to display a toast for certain action being triggered
        case organizationActions.CREATE_DEFAULT_ORGANIZATION_FAIL:
        case organizationActions.CREATE_ORGANIZATION_FAIL:
        case organizationActions.UPDATE_ORGANIZATION_DETAILS_SUCCESS:
        case organizationActions.UPDATE_ORGANIZATION_DETAILS_FAIL:
        case organizationActions.DELETE_ORGANIZATION_FAIL:
        case projectsActions.UPDATE_PROJECT_DETAILS_SUCCESS:
        case projectsActions.UPDATE_PROJECT_DETAILS_FAIL:
        case projectsActions.DELETE_PROJECT_FAIL:
        case projectsActions.DISCONNECT_PROJECT_REPOSITORY_SUCCESS:
        case projectsActions.DISCONNECT_PROJECT_REPOSITORY_FAIL:
        case organizationActions.RESEND_INVITATION_SUCCESS:
        case organizationActions.RESEND_INVITATION_FAIL:
        case organizationActions.ADD_MEMBER_TO_ORGANIZATION_SUCCESS:
        case organizationActions.ADD_MEMBER_TO_ORGANIZATION_FAIL:
        case organizationActions.REMOVE_MEMBER_FROM_ORGANIZATION_SUCCESS:
        case organizationActions.REMOVE_MEMBER_FROM_ORGANIZATION_FAIL:
        case userActions.CHECK_REPOSITORY_PERMISSIONS_FAIL:
            return pushToastToState();
        case toastActions.TOAST_DISMISSED:
            return {
                ...state,
                toasts: state.toasts.filter(toast => action.data !== toast.id),
            };
        default:
            return state;
    }
}
