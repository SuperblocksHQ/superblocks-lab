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

import React from 'react';
import classNames from 'classnames';
import { projectsActions, organizationActions, userActions } from '../../../actions';
import {
    IconInformation,
    IconCheckCircle,
    IconWarning,
    IconClose
} from '../icons';

export const CloseButton = () => (
    <button className={classNames(['closeIcon', 'btnNoBg'])}>
        <IconClose className={'icon'}/>
    </button>
);

const success = (text: string) => ({
    ToastComponent: () =>
    (
        <div className={'messageContainer'}>
            <IconCheckCircle/>
            {text}
        </div>
    ),
    className: classNames(['body', 'success'])
});

const info = (text: string) => ({
    ToastComponent: () =>
    (
        <div className={'messageContainer'}>
            <IconInformation/>
            {text}
        </div>
    ),
    className: classNames(['body', 'info'])
});

const error = (text: string) => ({
    ToastComponent: () =>
    (
        <div className={'messageContainer'}>
            <IconWarning/>
            {text}
        </div>
    ),
    className: classNames(['body', 'error'])
});

export const getToastComponent = (type: string, data: string) => {
    switch (type) {
        case projectsActions.CREATE_PROJECT_SUCCESS:
            return info('Project created!');
        case projectsActions.UPDATE_PROJECT_DETAILS_SUCCESS:
            return success('Sweet! Your project was updated successfully.');
        case projectsActions.UPDATE_PROJECT_DETAILS_FAIL:
            return error('Ups! Sorry there was an error. Try again.');
        case projectsActions.DELETE_PROJECT_FAIL:
            return error('Error deleting project: ' + data);
        case projectsActions.DISCONNECT_PROJECT_REPOSITORY_FAIL:
            return error('Error disconnecting repository: ' + data);
        case projectsActions.DISCONNECT_PROJECT_REPOSITORY_SUCCESS:
            return success('Repository was successfully disconnected.');
        case organizationActions.UPDATE_ORGANIZATION_DETAILS_SUCCESS:
            return success('Sweet! Your organization was updated successfully.');
        case organizationActions.UPDATE_ORGANIZATION_DETAILS_FAIL:
            return error('Ups! Sorry there was an error. Try again.');
        case organizationActions.DELETE_ORGANIZATION_FAIL:
            return error('Error deleting organization: ' + data);
        case organizationActions.CREATE_DEFAULT_ORGANIZATION_FAIL:
            return error('Error creating default organization: ' + data);
        case organizationActions.CREATE_ORGANIZATION_FAIL:
            return error('Error creating organization: ' + data);
        case organizationActions.ADD_MEMBER_TO_ORGANIZATION_SUCCESS:
            return success('Yay! User has been added to organization!');
        case organizationActions.ADD_MEMBER_TO_ORGANIZATION_FAIL:
            return error('Ups! Sorry there was an error. Try again.');
        case organizationActions.REMOVE_MEMBER_FROM_ORGANIZATION_SUCCESS:
            return success('User has been removed from organization!');
        case organizationActions.REMOVE_MEMBER_FROM_ORGANIZATION_FAIL:
            return error('Ups! Sorry there was an error. Try again.');
        case organizationActions.RESEND_INVITATION_SUCCESS:
            return success('Yay! The new invitation is on the way!');
        case organizationActions.RESEND_INVITATION_FAIL:
            return error('Ups! Sorry there was an error. Try again.');
        case userActions.CHECK_REPOSITORY_PERMISSIONS_FAIL:
            return error('Ups! Sorry there was an error checking for the repository permissions. Try again');
        default:
            return null;
    }
};
