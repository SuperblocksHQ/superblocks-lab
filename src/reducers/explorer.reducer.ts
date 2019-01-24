import { explorerActions } from '../actions';
import { replaceInArray, isValidProjectItemName, replaceOrRemoveInArray } from './utils';
import { IExplorerState, IItemNameValidation } from '../models/state';
import { IProjectItem, ProjectItemTypes } from '../models';
import { AnyAction } from 'redux';
import { generateUniqueId } from '../services/utils';

export const initialState: IExplorerState = {
    tree: null,
    itemNameValidation: { isValid: false },
    lastDeletedId: null
};

function sortProjectItems(items: IProjectItem[]) {
    return items.filter(x => x !== null).sort((a, b) => {
        if (a.type === b.type) {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        } else {
            return a.type === ProjectItemTypes.File ? 1 : -1;
        }
    });
}

function updateItemInTreeImpl(item: IProjectItem, id: string, modify: (i: IProjectItem) => Nullable<IProjectItem>): Nullable<IProjectItem> {
    if (item.children.some(c => c.id === id)) {
        let replacedItem: Nullable<IProjectItem> = null;
        item.children = sortProjectItems(replaceOrRemoveInArray(item.children, (c: IProjectItem) => c.id === id, x => {
            replacedItem = x;
            return modify(x);
        }));
        return replacedItem;
    } else {
        let itemToUpdate: Nullable<IProjectItem> = null;
        let replacedTargetItem: Nullable<IProjectItem> = null;

        for (const childItem of item.children) {
            const replacedItem = updateItemInTreeImpl(childItem, id, modify);
            if (replacedItem) {
                replacedTargetItem = replacedItem;
                itemToUpdate = childItem;
                break;
            }
        }

        if (itemToUpdate) {
            item.children = replaceInArray(item.children, i => i === itemToUpdate, i => ({ ...i }));
            return replacedTargetItem;
        }
    }

    return null;
}

function updateItemInTree(item: Nullable<IProjectItem>, id: string, modify: (i: IProjectItem) => Nullable<IProjectItem>): [Nullable<IProjectItem>, Nullable<IProjectItem>] {
    if (!item) {
        return [ item, null ];
    }

    const virtualRoot: any = { children: [ item ] };
    const replacedTargetItem = updateItemInTreeImpl(virtualRoot, id, modify);
    return [ virtualRoot.children[0], replacedTargetItem ];
}

export default function explorerReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case explorerActions.INIT_EXPLORER:
            return { ...state, tree: action.data };

        case explorerActions.TOGGLE_TREE_ITEM:
            return {
                ...state,
                tree: updateItemInTree(state.tree, action.data.id, (i: IProjectItem) => ({ ...i, opened: !i.opened }))[0]
            };

        case explorerActions.RENAME_ITEM: {
            let itemNameValidation: IItemNameValidation = initialState.itemNameValidation;
            let tree: Nullable<IProjectItem> = state.tree;

            if (isValidProjectItemName(action.data.name)) {
                const name = action.data.name.trim();
                const [newTree, replacedTargetItem] = updateItemInTree(state.tree, action.data.id, (i: IProjectItem) => ({ ...i, name }));
                if (replacedTargetItem) {
                    itemNameValidation = {
                        isValid: true,
                        name,
                        oldName: replacedTargetItem.name,
                        itemId: action.data.id
                    };
                    tree = newTree;
                }
            }

            return {
                ...state,
                tree,
                itemNameValidation
            };
        }

        case explorerActions.RENAME_ITEM_FAIL:
            return {
                ...state,
                tree: updateItemInTree(
                    state.tree,
                    action.data.id,
                    i => ({ ...i, name: action.data.oldName })
                )[0],
                itemNameValidation: initialState.itemNameValidation
            };

        case explorerActions.CREATE_ITEM: {

            let itemNameValidation: IItemNameValidation = initialState.itemNameValidation;
            let tree: Nullable<IProjectItem> = state.tree;

            if (isValidProjectItemName(action.data.name)) {
                const name = action.data.name.trim();
                const newItem: IProjectItem = {
                    id: generateUniqueId(),
                    name,
                    mutable: true,
                    type: action.data.itemType,
                    opened: false,
                    children: []
                };

                // add new item to the tree
                const [newTree, replacedTargetItem] = updateItemInTree(
                    state.tree,
                    action.data.parentId,
                    i => ({ ...i, children: sortProjectItems(i.children.concat([newItem])) })
                );

                // parent item was found and child was added
                if (replacedTargetItem) {
                    itemNameValidation = {
                        isValid: true,
                        name,
                        itemId: newItem.id
                    };
                    tree = newTree;
                }
            }
            return {
                ...state,
                tree,
                itemNameValidation
            };
        }

        case explorerActions.DELETE_ITEM: {
            const [tree, deletedItem] = updateItemInTree(state.tree, action.data.id, i => ({...i, deleted: true }));

            return {
                ...state,
                tree,
                lastDeletedId: deletedItem && deletedItem.id
            };
        }

        case explorerActions.CREATE_ITEM_FAIL:
        case explorerActions.DELETE_ITEM_SUCCESS:
            return {
                ...state,
                tree: updateItemInTree(state.tree, action.data.id, i => null)[0],
                itemNameValidation: initialState.itemNameValidation,
                lastDeletedId: null
            };

        case explorerActions.DELETE_ITEM_FAIL:
            return {
                ...state,
                tree: updateItemInTree(state.tree, action.data.id, i => ({...i, deleted: false}))[0],
                lastDeletedId: null
            };

        default:
            return state;
    }
}
