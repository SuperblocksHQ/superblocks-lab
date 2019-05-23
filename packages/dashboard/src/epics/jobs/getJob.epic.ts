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

import { of, zip } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { jobsActions } from '../../actions';
import { jobService } from '../../services';

const getJobTrace$ = (projectId: string, jobId: string) => jobService.getJobTrace(projectId, jobId).pipe(
    catchError(() => {
        return of({
            log: '[0KThis job has not started yet...\nThis job is in pending state and is waiting to be picked by a runner.'
        });
    })
);

export const getJob: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(jobsActions.GET_JOB_REQUEST),
    withLatestFrom(state$),
    switchMap(([action]) => {
        const projectId = action.data.projectId;
        const jobId = action.data.jobId;
        return zip(jobService.getJob(projectId, jobId), getJobTrace$(projectId, jobId), (job, trace) => {
            job.log = trace.log;
            return job;
        }).pipe(
            map(jobsActions.getJobSuccess),
            catchError((error) => {
                console.log('There was an issue fetching the job: ' + error);
                return of(jobsActions.getJobFail(error));
            })
        );
    })
);


