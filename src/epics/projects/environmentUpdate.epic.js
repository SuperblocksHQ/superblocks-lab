import { switchMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectActions } from '../../actions';
import { previewService } from '../../services';
import { empty } from 'rxjs';

export const environmentUpdateEpic = (action$, state$) => action$.pipe(
    ofType(projectActions.SET_ENVIRONMENT, projectActions.SELECT_PROJECT),
    switchMap(() => {
        previewService.setEnvironment(state$.value.projects.selectedProject.selectedEnvironment);
        return empty();
    }));
