import app from './app';
import projects from './projects.reducer';
import settings from './settings';
import sidePanels from './sidePanels.reducer';
import panes from './panes.reducer';

const rehydrated = (state = false, action) => {
    switch (action.type) {
        case 'persist/REHYDRATE':
            return true;
        default:
            return state;
    }
};

export default {
    rehydrated,
    app,
    settings,
    projects,
    sidePanels,
    panes
};
