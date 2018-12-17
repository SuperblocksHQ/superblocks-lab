import React from 'react';
import { IconFolder, IconFolderOpen } from '../../../icons';
import { BaseItem } from './baseItem';

export function FolderItem(props) {
    const toolbar = <span>tools</span>;
    return (
        <BaseItem
            {...props}
            toolbar={toolbar}
            icon={<IconFolder />}
            iconOpen={<IconFolderOpen />}>
        </BaseItem>
    );
}
