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

import { h, Component } from 'preact';
import {
    IconTrash,
    IconEdit
} from '../../../../icons';
import style from '../../style';
import { DropdownContainer } from '../../../../dropdown';
import { FadeInComponent } from './fadeInComponent';
import { ShowActions } from './showActions';

export class FileEntry extends Component {
    render() {
        const {
            openItem,
            title,
            isReadOnly,
            clickRenameFile,
            clickDeleteFile,
            contextMenu,
            icons
        } = this.props;

        const contextMenuFile = (
            <div class={style.contextMenu}>
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
            <DropdownContainer dropdownContent={contextMenuFile} useRightClick={true} onContextMenu={e => e.preventDefault()}>
                <div class={style.projectContractsTitleContainer} onClick={openItem}>
                    <ShowActions 
                        isReadOnly={isReadOnly} 
                        actionContainer={
                            <FadeInComponent>
                                <div class={style.buttons} onClick={e => e.stopPropagation()}>
                                    <a href="#" title="Rename file" onClick={clickRenameFile}>
                                        <IconEdit />
                                    </a>
                                    <a href="#" title="Delete file" onClick={clickDeleteFile} >
                                        <IconTrash />
                                    </a>
                                </div>  
                            </FadeInComponent>
                        }
                    >
                            {icons}
                            <div class={style.title}>
                                <a title={title} href="#">
                                    {title}
                                </a>
                            </div>
                    </ShowActions>
                </div>
            </DropdownContainer>
        );
    }
}