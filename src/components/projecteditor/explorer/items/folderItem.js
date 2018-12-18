import React from 'react';
import { IconFolder, IconFolderOpen, IconAddFile, IconImportFile, IconAddFolder, IconEdit, IconTrash } from '../../../icons';
import { BaseItem } from './baseItem';
import style from './style.less';

export function FolderItem(props) {
    const toolbar = <span>tools</span>;

    const contextMenu=(
        <div className={ style.contextMenu }>
            <div onClick={ props.onCreateFileClick }>
                <div className={style.icon} >
                    <IconAddFile />
                </div>
                Create File
            </div>
            <div onClick={ props.onImportFileClick }>
                <div className={style.icon} >
                    <IconImportFile />
                </div>
                Import File
            </div>
            <div onClick={ props.onCreateFolderClick }>
                <div className={style.icon} >
                    <IconAddFolder />
                </div>
                Create Folder
            </div>
            { props.data.mutable &&
                <React.Fragment>
                <div onClick={ props.onRenameClick }>
                    <div className={style.icon}>
                        <IconEdit />
                    </div>
                    Rename
                </div>
                <div onClick={ props.onDeleteClick }>
                    <div className={style.icon}>
                        <IconTrash />
                    </div>
                    Delete
                </div>
                </React.Fragment>
            }
        </div>
    );

    return (
        <BaseItem
            { ...props }
            toolbar={ toolbar }
            icon={ <IconFolder /> }
            iconOpen={ <IconFolderOpen /> }
            contextMenu={ contextMenu }>
        </BaseItem>
    );
}
