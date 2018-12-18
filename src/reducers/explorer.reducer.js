import { explorerActions } from '../actions'
import { replaceInArray } from './utils';

export const initialState = {
    tree: {
        id: '123',
        name: 'Files', 
        type: 'FOLDER',
        togglable: true,
        opened: true,
        mutable: false,
        children: [
            {
                id: '1234',
                name: 'contracts', 
                type: 'FOLDER',
                togglable: true,
                opened: false,
                mutable: true,
                children: [
                    { id: '12345', name: 'smth.sol', type: 'FILE', children: [], togglable: true, mutable: true },
                ]
            },
            {
                id: '1236',
                name: 'smth else', 
                type: 'FOLDER',
                togglable: true,
                opened: false,
                mutable: true,
                children: [
                ]
            },

            {
                id: '34235',
                name: 'dapp.json', 
                type: 'FILE',
                togglable: false,
                mutable: false,
                children: [ ]
            },
            {
                id: '1235',
                name: 'README.md', 
                type: 'FILE',
                togglable: false,
                mutable: true,
                children: [ ]
            }
        ]
    }
};

function updateItemInTree(item, id, modify) {
    if (item.children.some(c => c.id === id)) {
        item.children = replaceInArray(item.children, c => c.id === id, modify);
        return true;
    } else {
        let itemToUpdate = null;
        for (const childItem of item.children) {
            if (updateItemInTree(childItem, id, modify)) {
                itemToUpdate = childItem;
                break;
            }
        }

        if (itemToUpdate) {
            item.children = replaceInArray(item.children, i => i === itemToUpdate, i => ({ ...i }));
            return true;
        }
    }

    return false;
}

export default function explorerReducer(state = initialState, action) {
    switch (action.type) {
        case explorerActions.TOGGLE_TREE_ITEM: {
            const virtualRoot = { children: [ state.tree ] };
            updateItemInTree(virtualRoot, action.data.id, i => ({ ...i, opened: !i.opened }));
            return { ...state, tree: virtualRoot.children[0] };
        }
        default:
            return state;
    }
}
