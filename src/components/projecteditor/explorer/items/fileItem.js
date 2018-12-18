import React from 'react';
import { IconFile, IconHtml, IconCss, IconJS, IconMd, IconContract, IconJSON, IconBinary, IconEdit, IconTrash } from '../../../icons';
import { BaseItem } from './baseItem';
import style from './style.less';

// TODO: this funcion may be used in panes as well
function getFileIcon(filename) {
    const fileExtension = filename.toLowerCase().split('.').pop();
    switch(fileExtension)
    {
        case 'sol':
            return <IconContract />;
        case 'html':
            return <IconHtml />;
        case 'css':
            return <IconCss />;
        case 'js':
            return <IconJS />;
        case 'md':
            return <IconMd />;
        case 'json':
            return <IconJSON />;
        case 'bin':
            return <IconBinary />;
        default:
            return <IconFile />;
    }
}

export function FileItem(props) {
    const toolbar = <span>edit tools</span>;

    const contextMenu= props.data.mutable ? (
        <div className={ style.contextMenu }>
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
        </div>
    ) : null;

    return (
        <BaseItem
            { ...props }
            toolbar={ toolbar }
            contextMenu={ contextMenu }
            icon={ getFileIcon(props.data.name) } />
    );
}
