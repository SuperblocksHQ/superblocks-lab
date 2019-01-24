// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { projectsActions } from '../actions/projects.actions';
import Networks from '../networks';

const DAPP_FILE_NAME = 'dappfile.json';
export const initialState = {
    isProjectSelected: false,
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
        case projectsActions.SELECT_PROJECT: {
            let selectedProject = initialState.selectedProject;
            let isProjectSelected = false;
            
            if (action.data) {
                const dappData = JSON.parse(action.data.tree.children.find(c => c.name === DAPP_FILE_NAME).code);
                const environments = dappData.environments.map(e => ({ name: e.name, endpoint: Networks[e.name].endpoint }))
                
                selectedProject = {
                    id: action.data.id,
                    name: dappData.project.info.name,
                    environments,
                    selectedEnvironment: getEnvOrNull(state.selectedProject.selectedEnvironment)
                            || environments[0]
                            || initialState.selectedProject.selectedEnvironment
                };

                isProjectSelected = true;
            }
            
            return {
                ...state,
                selectedProject,
                isProjectSelected
            };
        }
        case projectsActions.SET_ENVIRONMENT:
            return {
                ...state,
                selectedProject: {
                    ...state.selectedProject,
                    selectedEnvironment: state.selectedProject.environments.find(e => e.name === action.data) 
                                        || initialState.selectedProject.selectedEnvironment
                }
            };

        case projectsActions.UPDATE_PROJECT_SETTINGS_SUCCESS: {
            return {
                ...state,
                selectedProject: {
                    ...state.selectedProject,
                    name: action.data.name
                },
            };
        }
        default:
            return state;
    }
}
