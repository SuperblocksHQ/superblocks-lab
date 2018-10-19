// Copyright 2018 Superblocks AB
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

import React, { Component } from 'react';
import {
    IconTrash,
    IconEdit,
    IconAddFile,
    IconAddFolder
} from '../../../../icons';
import style from '../../style.less';
import { DropdownContainer } from '../../../../dropdown';
import { FadeInComponent } from './fadeInComponent';
import { ShowActions } from './showActions';

export class DirectoryEntry extends Component {
    render() {
        const {
            title,
            angleClicked,
            clickNewFile,
            clickNewFolder,
            clickRenameFile,
            clickDeleteFile,
            contextMenu,
            fullPath,
            icons
        } = this.props;

        const alwaysVisible = fullPath === "/";

        const contextMenuDirectory=(
            <div class={style.contextMenu}>
                <div onClick={clickNewFile}>
                    <div class={style.icon} >
                        <IconAddFile />
                    </div>
                    Create File
                </div>
                <div onClick={clickNewFolder}>
                    <div class={style.icon} >
                        <IconAddFolder />
                    </div>
                    Create Folder
                </div>
                <div onClick={clickRenameFile}>
                    <div class={style.icon}>
                        <IconEdit />
                    </div>
                    Rename
                </div>
                <div onClick={clickDeleteFile}>
                    <div class={style.icon}>
                        <IconTrash />
                    </div>
                    Delete
                </div>
            </div>
        );

        return (
            <DropdownContainer dropdownContent={contextMenuDirectory} useRightClick={true}>
                <div class={style.projectContractsTitleContainer} onClick={angleClicked} onContextMenu={(e) => e.preventDefault()}>
                    <ShowActions
                        alwaysVisible={alwaysVisible}
                        actionContainer={
                            <FadeInComponent>
                                <div class={style.buttons} onClick={(e) => e.stopPropagation()}>
                                    <a href="#" title="New File" onClick={clickNewFile}>
                                        <IconAddFile />
                                    </a>
                                    <a href="#" title="New Folder" onClick={clickNewFolder}>
                                        <IconAddFolder />
                                    </a>
                                    {
                                        fullPath != "/" &&
                                            <div style="display: inline;">
                                                <a href="#" title="Rename directory" onClick={clickRenameFile}>
                                                    <IconEdit />
                                                </a>
                                                <a href="#" title="Delete directory" onClick={clickDeleteFile}>
                                                    <IconTrash />
                                                </a>
                                            </div>
                                    }
                                </div>
                            </FadeInComponent>
                        }
                    >
                            {icons}
                            <div class={style.title} title={title}>
                                <a href="#">{title}</a>
                            </div>
                    </ShowActions>
                </div>
            </DropdownContainer>
        );
    }
}
