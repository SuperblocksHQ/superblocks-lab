import React from 'react';
import { IconFile, IconHtml, IconCss, IconJS, IconMd, IconContract, IconJSON, IconBinary } from '../../../icons';
import { BaseItem } from './baseItem';

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
    return (
        <BaseItem
            { ...props }
            toolbar={ toolbar }
            icon={ getFileIcon(props.data.name) } />
    );
}
