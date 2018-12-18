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

    onFileClick() {

    }

    onFolderClick() {

    }

    renderTree(itemData, actions) {
        const childHtml = itemData.children.map(i => this.renderTree(i, actions));

        if (itemData.type === ExplorerItemTypes.FILE) {
            if (itemData.name.toLowerCase().endsWith('.sol')) {
                return (
                    <ContractItem key={ itemData.id }
                        data={ itemData }

                        onToggle={ actions.toggleTreeItem }
                        onClick={ actions.openFile }
                        onRenameClick={ actions.renameItem }
                        onDeleteClick={ actions.deleteItem }

                        onConfigureClick={ actions.configureContract }
                        onCompileClick={ actions.compileContract }
                        onDeployClick={ actions.deployContract }
                        onInteractClick={ actions.interactContract } />
                );
            } else {
                return (
                    <FileItem key={ itemData.id }
                        data={ itemData }
                        onClick={ actions.openFile }
                        onRenameClick={ actions.renameItem }
                        onDeleteClick={ actions.deleteItem } />
                );
            }
        }
        else if (itemData.type === ExplorerItemTypes.FOLDER) {
            return (
                <FolderItem key={ itemData.id }
                        data={ itemData }
                        onClick={ actions.toggleTreeItem }
                        onToggle={ actions.toggleTreeItem }

                        onCreateFileClick={ actions.createFile }
                        onImportFileClick={ actions.importFile }
                        onCreateFolderClick={ actions.createFolder }
                        onRenameClick={ actions.renameItem }
                        onDeleteClick={ actions.deleteItem }>
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
