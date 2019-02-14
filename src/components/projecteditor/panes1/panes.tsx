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

import React from 'react';
import classnames from 'classnames';
import style from './style.less';
import { PaneTabs } from './paneTabs';
import { IPane } from '../../../models/state';
import { FileEditor } from './editors';
import { IProjectItem } from '../../../models';

interface IProps {
    panes: IPane[];
    dragging: boolean;
    onFileChange: (fileId: string, code: string) => void;
    onOpenFile: (fileItem: IProjectItem) => void;
    onClosePane: (fileId: string) => void;
    onCloseAllOtherPanes: (fileId: string) => void;
    onCloseAllPanes: () => void;
}

export function Panes(props: IProps) {
    return (
        <div className={classnames(style.panescontainer, { dragging: props.dragging })}>
            <div className={style.header}>
                <PaneTabs
                    panes={props.panes}
                    onTabClick={props.onOpenFile}
                    onTabClose={props.onClosePane}
                    onCloseAllOtherTabs={props.onCloseAllOtherPanes}
                    onCloseAllTabs={props.onCloseAllPanes} />
            </div>
            <div className={style.panes}>
            {
                props.panes.map((pane) =>
                    <div key={pane.file.id} className={classnames(style.pane, { [style.visible]: pane.active })}>
                        <FileEditor file={pane.file} onFileChange={props.onFileChange} />
                    </div>
                )
            }
            </div>
        </div>
    );
}
