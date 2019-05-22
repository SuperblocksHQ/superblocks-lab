import { Theme } from '../components/common/topbar/themeSwitcher';

export const appActions = {
    APP_START: 'APP_START',
    notifyAppStart() {
        return {
            type: appActions.APP_START
        };
    },
    APP_STARTED: 'APP_STARTED',
    notifyAppStarted() {
        return {
            type: appActions.APP_STARTED,
        };
    },
    INIT_EVM: 'INIT_EVM',
    initEvm() {
        return {
            type: appActions.INIT_EVM
        };
    },
    EVM_READY: 'EVM_READY',
    emvReady() {
        return {
            type: appActions.EVM_READY
        };
    },
    CHANGE_APP_THEME: 'CHANGE_APP_THEME',
    changeAppTheme(appTheme: Theme) {
        return {
            type: appActions.CHANGE_APP_THEME,
            data: { appTheme }
        };
    }
};
