// Copyright 2019 Superblocks AB
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

import { convertProject1_1to1_2, generateUniqueId, readLocalStorageJSON, saveLocalStorageJSON } from './utils';
import { Observable, of, throwError } from 'rxjs';
import { IProjectItem, ProjectItemTypes, IProject, IProjectInfo } from '../models';

enum DappVersions {
    VERSION_1_1 = 'dapps1.1.0',
    VERSION_1_2 = 'dapps1.2.0'
}

export const projectsService = {
    init() {
        if (localStorage.getItem(DappVersions.VERSION_1_1)) {
            const data = readLocalStorageJSON(DappVersions.VERSION_1_1);
            const projects = data.projects.map((p: any) => {
                const resultTree: IProjectItem = {
                    id: generateUniqueId(),
                    name: 'Files',
                    type: ProjectItemTypes.Folder,
                    opened: true,
                    mutable: false,
                    isRoot: true,
                    children: []
                };
                convertProject1_1to1_2(p.files['/'].children, resultTree);
                return { tree: resultTree, id: p.inode.toString() };
            });

            saveLocalStorageJSON(DappVersions.VERSION_1_2, { projects });
            localStorage.removeItem(DappVersions.VERSION_1_1);
            console.log('Migration to dapp v 1.2.0 is complete');
        }
    },

    loadProjectsList(): Observable<IProjectInfo[]> {
        const data = readLocalStorageJSON(DappVersions.VERSION_1_2) || { projects: [] };
        return of(data.projects.map((p: any) => {
            const dappData = JSON.parse(p.tree.children.find((c: IProjectItem) => c.name === 'dappfile.json').code);
            return <IProjectInfo>{ id: p.id, name: dappData.project.info.name, title: dappData.project.info.title };
        }));
    },

    loadProject(id: string): Observable<IProject> {
        const projects: IProject[] = readLocalStorageJSON(DappVersions.VERSION_1_2).projects || [];
        const project = projects.find((p: IProject) => p.id === id);
        return project ? of(project) : throwError({ message: 'Error while loading projects' });
    },

    updateProject(project: IProject): Observable<any> {
        const projects: IProject[] = readLocalStorageJSON(DappVersions.VERSION_1_2).projects || [];
        const projectIndex = projects.findIndex((p: IProject) => p.id === project.id);
        if (projectIndex >= 0) {
            projects.splice(projectIndex, 1, project);
            saveLocalStorageJSON(DappVersions.VERSION_1_2, { projects });
            return of(true);
        } else {
            return throwError({ message: 'Error while updating project' });
        }
    }
};
