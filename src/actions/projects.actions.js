export const projectActions = {
    SELECT_PROJECT: 'SELECT_PROJECT',
    selectProject(project) {
        return {
            type: projectActions.SELECT_PROJECT,
            data: project
        };
    },

    SET_ENVIRONMENT: 'SET_ENVIRONMENT',
    setEnvironment(environment) {
       return {
            type: projectActions.SET_ENVIRONMENT,
            data: environment
       };
    }
};
