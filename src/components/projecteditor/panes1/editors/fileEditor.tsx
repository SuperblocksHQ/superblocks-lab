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
import style from './style-editor.less';
import MonacoEditor from 'react-monaco-editor';
import { IProjectItem } from '../../../../models';

interface IProps {
    file: IProjectItem;
    onFileChange: (fileId: string, code: string) => void;
}

const langmap: any = {
    js: 'javascript',
    sh: 'shell',
    bash: 'shell',
    md: 'markdown',
};

const requireConfig = {
    paths: { vs: 'vs' },
    url: '/vs/loader.js',
    baseUrl: '/'
};

export class FileEditor extends React.Component<IProps> {
    language: string = '';
    options: any = {};

    constructor(props: IProps) {
        super(props);

        const a = props.file.name.match('.*[.]([^.]+)$');
        if (a) {
            const suffix = a[1].toLowerCase();
            this.language = langmap[suffix] ? langmap[suffix] : suffix;
        }

        this.options = {
            selectOnLineNumbers: true,
            readOnly: !this.props.file.mutable,
            folding: 'true',
            foldingStrategy: 'indentation',
        };
    }

    // editorDidMount = (editorObj, monacoObj) => {
    //     this.editorObj = editorObj;
    //     this.monacoObj = monacoObj;
    //     editorObj.addCommand(
    //         monacoObj.KeyMod.CtrlCmd | monacoObj.KeyCode.KEY_S,
    //         () => {
    //             this.save();
    //         }
    //     );
    //     this.focus();
    // };

    render() {
        const { file } = this.props;

        return (
            <div className='full'>
                {/* {toolbar} */}
                <MonacoEditor
                    language={this.language}
                    theme='vs-dark'
                    value={file.code}
                    options={this.options}
                    onChange={(value: string) => this.props.onFileChange(file.id, value)}
                    // editorDidMount={(obj, monaco) =>
                    //     this.editorDidMount(obj, monaco)
                    // }
                    requireConfig={requireConfig}
                />
            </div>
        );
    }
}
