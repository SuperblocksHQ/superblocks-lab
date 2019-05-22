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

import React, { Component } from 'react';
import style from './style.less';
import { BreadCrumbs, TextInput, TextAreaInput, StyledButton } from '../../../common';
import { StyledButtonType } from '../../../../models/button.model';
import { Link } from 'react-router-dom';
import { validateOrganizationName } from '../../../../validations';
import { IUser } from '../../../../models';

interface IProps {
    location: any;
    match: any;
    user: IUser;
    updateUserProfile: (newUserProfile: Partial<IUser>) => void;
}

interface IState {
    errorName: string | null;
    newUserName: string;
    newEmail: string;
    canSave: boolean;
}

export default class Profile extends Component<IProps, IState> {

    state: IState = {
        errorName: null,
        newUserName: this.props.user.userName,
        newEmail: this.props.user.email,
        canSave: true
    };

    onUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUserName = e.target.value || ' ';
        const errorName = newUserName ? validateOrganizationName(newUserName) : null;

        this.setState({
            errorName,
            newUserName,
            canSave: !errorName
        });
    }

    onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;

        this.setState({
            newEmail
        });
    }

    onSave = (e?: any) => {
        const { updateUserProfile, user } = this.props;
        const { newUserName: newUserName, newEmail, canSave } = this.state;
        e.preventDefault();

        if (canSave) {
            updateUserProfile({id: user.id, userName: newUserName, email: newEmail});
        }
    }

    render() {
        const { user } = this.props;
        const { errorName, canSave } = this.state;

        return (
            <React.Fragment>
                <div className={style.details}>
                    <BreadCrumbs>
                    <Link to={`/settings/profile`}>Account Settings</Link>
                    <Link to={window.location.pathname}>Profile</Link>
                    </BreadCrumbs>

                    <h1>Profile</h1>
                    <form onSubmit={(e) => this.onSave(e)}>
                        <div className={style['mb-5']}>
                            <TextInput
                                onChangeText={this.onEmailChange}
                                error={errorName}
                                label={'Email address'}
                                id={'email'}
                                defaultValue={user.email}
                                required={true}
                            />
                        </div>
                        <div className={style['mb-4']}>
                            <TextInput
                                onChangeText={this.onUserNameChange}
                                label={'Username'}
                                id={'userName'}
                                defaultValue={user.userName}
                            />
                        </div>
                        <StyledButton type={StyledButtonType.Primary} text={'Save Details'} onClick={this.onSave} isDisabled={!canSave}/>
                    </form>
                    <div className={style.sectionDivider}></div>
                </div>
            </React.Fragment>
        );
    }
}
