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
import { Redirect } from 'react-router-dom';
import style from './style.less';
import { IconGithub } from '../../common/icons';
import { StyledButton } from '../../common';
import { StyledButtonType } from '../../../models';

interface IProps {
    githubLogin: () => void;
    location: any;
    isAuthenticated: boolean;
}

export default class LoginScreen extends Component<IProps> {
    state = {
        redirectToReferrer: false
    };

    componentDidUpdate() {
        if (this.props.isAuthenticated) {
            this.setState({
                redirectToReferrer: true
            });
        }
    }

    onGithubLoginButtonClick = () => {
        this.props.githubLogin();
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to={from} />;
        }

        return (
            <div className={style.screenWrapper}>
                <div className={style.loginBlock}>
                    <img src='/static/img/img-logo-dashboard.svg' />
                    <p>Log in to continue to Superblocks</p>
                    <StyledButton
                        onClick={this.onGithubLoginButtonClick}
                        text={'Login with Github'}
                        icon={<IconGithub className={style.githubIcon} />}
                        type={StyledButtonType.Primary}
                        className={style.loginBtn}
                    />
                </div>
            </div>
        );
    }
}
