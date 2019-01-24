import { environmentUpdateEpic } from './environmentUpdate.epic';
import { updateProjectSettings } from './updateProjectSettings.epic';
import { initExplorerEpic } from './initExplorer.epic';

export const projectsEpics = [
    environmentUpdateEpic,
    updateProjectSettings,
    initExplorerEpic
];
