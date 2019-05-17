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

import { jobsActions } from '../actions';
import { IJobState } from '../models/state';
import { AnyAction } from 'redux';

export const initialState: IJobState = {
    job: undefined,
    loadingJob: false,
};

export default function projectsReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case jobsActions.GET_JOB_REQUEST: {
            return {
                ...state,
                loadingJob: true
            };
        }
        case jobsActions.GET_JOB_SUCCESS: {
            return {
                ...state,
                job: { ...action.data.job },
                loadingJob: false
            };
        }
        case jobsActions.GET_JOB_FAIL: {
            console.log('job load failed', action.data);

            return {
                ...state,
                loadingJob: false
            };
        }
        default:
            return state;
    }
}
