import { switchMap, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { projectsActions } from '../../actions';
import { previewService } from '../../services';
import { projectSelectors } from '../../selectors';
import Networks from '../../networks';
import { empty, from } from 'rxjs';

function hasEnvironments(state) {
    return state.projects.selectedProject.environments.length
}

export const environmentUpdateEpic = (action$, state$) => action$.pipe(
    ofType(projectsActions.SET_ENVIRONMENT, projectsActions.SELECT_PROJECT),
    switchMap(() => {
        if (!hasEnvironments(state$.value)) {
            return empty();
        }

        const selectedEnvironment = projectSelectors.getSelectedEnvironment(state$.value);
        // update preview service
        previewService.setEnvironment(selectedEnvironment);

        // enable metamask
        if (selectedEnvironment.name !== Networks.browser.name &&
            selectedEnvironment.name !== Networks.custom.name) {
            return from(web3.currentProvider.enable()).pipe(
                // do nothing if user gives access to metamask
                switchMap(() => empty()),
                // set env back to browser in case user reject metamask access
                catchError(() => [projectsActions.setEnvironment(Networks.browser.name)])
            );
        }
        return empty();
    }));
