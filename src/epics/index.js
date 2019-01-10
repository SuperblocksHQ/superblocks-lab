import { settingsEpics } from './settings';
import { sidePanelsEpics } from './sidePanels';
import { projectsEpics } from './projects';

export const epics = [
    ...settingsEpics,
    ...sidePanelsEpics,
    ...projectsEpics
];
