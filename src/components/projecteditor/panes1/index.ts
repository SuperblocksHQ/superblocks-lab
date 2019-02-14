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

import { Dispatch } from 'redux';
import { IProjectItem } from '../../../models';
import { connect } from 'react-redux';
import { Panes } from './panes';
import { panesActions } from '../../../actions';

function traverseTree(item: IProjectItem, callback: (item: IProjectItem) => boolean): boolean {
    if (callback(item)) {
        return true;
    }

    for (const childItem of item.children) {
        if (traverseTree(childItem, callback)) {
            break;
        }
    }

    return false;
}

function getPanesAndItems(state: any) {
    const panes = state.panes.panes.slice();
    let counter = 0;
    traverseTree(state.explorer.tree, (item) => {
       const index = panes.findIndex((p: IProjectItem) => p.id === item.id);
       if (index >= 0) {
           panes[index].item = item;
           ++counter;
       }
       return counter === panes.length;
    });
}

const mapStateToProps = (state: any) => ({
    panes: state.panes.items,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onFileChange(fileId: string, code: string) {
            // dispatch(panesActions.addPane(id, name, fileId))
        },
        onOpenFile(fileItem: IProjectItem) {
            dispatch(panesActions.openFile(fileItem));
        },
        onClosePane(fileId: string) {
            dispatch(panesActions.closePane(fileId));
        },
        onCloseAllOtherPanes(fileId: string) {
            dispatch(panesActions.closeAllOtherPanes(fileId));
        },
        onCloseAllPanes() {
            dispatch(panesActions.closeAllPanes());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Panes);
