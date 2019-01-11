import { switchMap, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectActions } from '../../actions';
import { previewService } from '../../services';
import { getSelectedEnvironment } from '../../selectors/projects';
import { Constants } from '../../utils';
import { empty, from } from 'rxjs';

export const environmentUpdateEpic = (action$, state$) => action$.pipe(
    ofType(projectActions.SET_ENVIRONMENT, projectActions.SELECT_PROJECT),
    switchMap(() => {
        // update preview service
        previewService.setEnvironment(state$.value.projects.selectedProject.selectedEnvironment);

        // enable metamask
        const selectedEnvironment = getSelectedEnvironment(state$.value);
        if (selectedEnvironment.name !== Constants.ENV_BROWSER &&
            selectedEnvironment.name !== Constants.ENV_CUSTOM) {
            return from(web3.currentProvider.enable()).pipe(
                // do nothing if user gives access to metamask
                switchMap(() => empty()),
                // set env back to browser in case user reject metamask access
                catchError(() => [projectActions.setEnvironment(Constants.ENV_BROWSER)])
            );
        }
        return empty();
    }));
