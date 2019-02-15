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
import { EditorToolbar } from './editorToolbar';
import { isSmartContract, getFileExtension } from '../../../../utils/file';

interface IProps {
    file: IProjectItem;
    onSave: (fileId: string, code: string) => void;
    onCompile: (file: IProjectItem) => void;
    onDeploy: (file: IProjectItem) => void;
    onInteract: (file: IProjectItem) => void;
    onConfigure: (file: IProjectItem) => void;
}

interface IState {
    hasUnsavedChanges: boolean;
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

export class FileEditor extends React.Component<IProps, IState> {
    language: string = '';
    options: any = {};
    code: string = '';

    constructor(props: IProps) {
        super(props);

        this.state = {
            hasUnsavedChanges: false
        };

        const suffix = getFileExtension(props.file.name);
        if (suffix) {
            this.language = langmap[suffix] ? langmap[suffix] : suffix;
        }

        this.options = {
            selectOnLineNumbers: true,
            readOnly: !this.props.file.mutable,
            folding: 'true',
            foldingStrategy: 'indentation',
        };

        this.code = props.file.code || '';
    }

    editorDidMount = (editor: any, monacoObj: any) => {
        editor.addCommand(monacoObj.KeyMod.CtrlCmd | monacoObj.KeyCode.KEY_S, this.onSave);
        editor.focus();
    }

    onFileChange = (value: string) => {
        this.code = value;
        this.setState({ hasUnsavedChanges: this.code !== this.props.file.code });
    }

    onSave = () => {
        this.props.onSave(this.props.file.id,  this.code);
    }

    render() {
        const { file } = this.props;

        return (
            <div className={style.fileEditorContainer}>
                <EditorToolbar
                    isSmartContract={isSmartContract(file.name)}
                    hasUnsavedChanges={this.state.hasUnsavedChanges}
                    onSave={this.onSave}
                    onCompile={ () => this.props.onCompile(file) }
                    onDeploy={ () => this.props.onDeploy(file) }
                    onConfigure={ () => this.props.onConfigure(file) }
                    onInteract={ () => this.props.onInteract(file) }  />

                <MonacoEditor
                    language={this.language}
                    theme='vs-dark'
                    value={file.code}
                    options={this.options}
                    onChange={this.onFileChange}
                    editorDidMount={this.editorDidMount}
                    requireConfig={requireConfig}
                />
            </div>
        );
    }
}
