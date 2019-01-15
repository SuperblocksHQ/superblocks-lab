export const projectsActions = {
    SELECT_PROJECT: 'SELECT_PROJECT',
    selectProject(project) {
        return {
            type: projectsActions.SELECT_PROJECT,
            data: project
        };
    },

    SET_ENVIRONMENT: 'SET_ENVIRONMENT',
    setEnvironment(environmentName) {
       return {
            type: projectsActions.SET_ENVIRONMENT,
            data: environmentName
       };
    },

    UPDATE_PROJECT_SETTINGS: 'UPDATE_PROJECT_SETTINGS',
    updateProjectSettings(projectSettings) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS,
            data: projectSettings
        };
    },
    UPDATE_PROJECT_SETTINGS_SUCCESS: 'UPDATE_PROJECT_SETTINGS_SUCCESS',
    updateProjectSettingsSuccess(newProjectSettings) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS_SUCCESS,
            data: newProjectSettings,
        };
    },
    UPDATE_PROJECT_SETTINGS_FAIL: 'UPDATE_PROJECT_SETTINGS_FAIL',
    updateProjectSettingsFail(error) {
        return {
            type: projectsActions.UPDATE_PROJECT_SETTINGS_FAIL,
            error: error
        };
    }
};
