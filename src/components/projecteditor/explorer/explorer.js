import React from 'react';
import style from './style.less';
import LearnAndResources from '../../learnAndResources';
import { FolderItem, FileItem, ContractItem } from './items';

const ExplorerItemTypes = {
    FILE: 'FILE',
    FOLDER: 'FOLDER'
};

export class Explorer extends React.Component { 
    constructor(props) {
        super(props);
    }

    renderTree(itemData, actions) {
        const childHtml = itemData.children.map(i => this.renderTree(i, actions));

        if (itemData.type === ExplorerItemTypes.FILE) {
            if (itemData.name.toLowerCase().endsWith('.sol')) {
                return (
                    <ContractItem key={ itemData.id }
                        data={ itemData }

                        onToggle={ actions.onToggleTreeItem }
                        onClick={ actions.onOpenFile }
                        onRenameClick={ actions.onRenameItem }
                        onDeleteClick={ actions.onDeleteItem }

                        onConfigureClick={ actions.onConfigureContract }
                        onCompileClick={ actions.onCompileContract }
                        onDeployClick={ actions.onDeployContract }
                        onInteractClick={ actions.onInteractContract } />
                );
            } else {
                return (
                    <FileItem key={ itemData.id }
                        data={ itemData }
                        onClick={ actions.onOpenFile }
                        onRenameClick={ actions.onRenameItem }
                        onDeleteClick={ actions.onDeleteItem } />
                );
            }
        }
        else if (itemData.type === ExplorerItemTypes.FOLDER) {
            return (
                <FolderItem key={ itemData.id }
                        data={ itemData }
                        onClick={ actions.onToggleTreeItem }
                        onToggle={ actions.onToggleTreeItem }

                        onCreateFileClick={ actions.onCreateFile }
                        onImportFileClick={ actions.onImportFile }
                        onCreateFolderClick={ actions.onCreateFolder }
                        onRenameClick={ actions.onRenameItem }
                        onDeleteClick={ actions.onDeleteItem }>
                        { childHtml }
                </FolderItem>
            );
        }
        else {
            throw new Error('Unsupported item type');
        }
    }

    render() {
        const treeHtml = this.renderTree(this.props.tree, this.props);
        return (
            <div className="full">
                <div className={ style.treeContainer }>
                    { treeHtml }
                    <LearnAndResources className="mt-3" />
                </div>
            </div>
        );
    }
}
