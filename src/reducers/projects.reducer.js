import { projectActions } from '../actions/projects.actions';

export const initialState = {
    selectedProject: {
        id: 0,
        name: '',
        environments: [],
        selectedEnvironment: { name: null, endpoint: null }
    }
};

function getEnvOrNull(environment) {
    return (environment && environment.name)
        ? environment
        : null;
}

export default function projectsReducer(state = initialState, action) {
    switch (action.type) {
        case projectActions.SELECT_PROJECT: {
            return {
                ...state,
                selectedProject: action.data 
                    ? { 
                        ...action.data,
                        selectedEnvironment: getEnvOrNull(state.selectedProject.selectedEnvironment)
                            || action.data.environments[0]
                            || initialState.selectedProject.selectedEnvironment
                    } : initialState.selectedProject,
            };
        }
        case projectActions.SET_ENVIRONMENT:
            return {
                ...state,
                selectedProject: {
                    ...state.selectedProject,
                    selectedEnvironment: state.selectedProject.environments.find(e => e.name === action.data) 
                                        || initialState.selectedProject.selectedEnvironment
                }
            };
        default:
            return state;
    }
}
