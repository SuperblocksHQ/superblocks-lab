import { connect } from 'react-redux';
import { explorerActions } from '../../../actions';
import { Explorer } from './explorer';

const mapStateToProps = state => ({
    ...state.explorer
});

const mapDispatchToProps = (dispatch) => {
    return {
        onToggleTreeItem: (id) => {
            dispatch(explorerActions.toggleTreeItem(id));
        },
        onOpenFile: (id) => {
            dispatch(explorerActions.openFile(id));
        },
        onConfigureContract: (id, name) => {
            dispatch(explorerActions.configureContract(id, name));
        },
        onCompileContract: (id, name) => {
            dispatch(explorerActions.compileContract(id, name));
        },
        onDeployContract: (id, name) => {
            dispatch(explorerActions.deployContract(id, name));
        },
        onInteractContract: (id, name) => {
            dispatch(explorerActions.interactContract(id, name));
        },
        onCreateFile: (parentId) => {
            dispatch(explorerActions.createFile(parentId));
        },
        onImportFile: (parentId) => {
            dispatch(explorerActions.importFile(parentId));
        },
        onCreateFolder: (parentId) => {
            dispatch(explorerActions.createFolder(parentId));
        },
        onRenameItem: (id) => {
            dispatch(explorerActions.renameItem(id)); // TODO: check if correct
        },
        onDeleteItem: (id) => {
            dispatch(explorerActions.deleteItem(id));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
