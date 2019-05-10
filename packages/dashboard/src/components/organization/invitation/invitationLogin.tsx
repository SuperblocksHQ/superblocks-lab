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
import classNames from 'classnames';
import style from './style.less';
import { IconSuperblocks } from '../../common/icons/index';
import GithubLoginButton from '../../common/buttons/githubLogin';

interface IProps {
    invitation: any;
    githubLogin: () => void;
    location: any;
    isAuthenticated: boolean;
}


export default class InvitationLogin extends Component<IProps> {
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

        const { invitation } = this.props;

        if (redirectToReferrer === true) {
            return <Redirect to={from} />;
        }

        return (
            <div className={classNames([style.loginModal, 'modal'])}>
                <div className={style.container}>
                    <div className={style.area}>
                        <div className={style.headerText}>
                            <span>You have been invited to join {invitation.organizationName}</span>
                        </div >
                        <div className={style.superblocks}>
                            <IconSuperblocks />
                        </div>
                        <div className={style.promoText}>
                            <span>In order to join {invitation.organizationName}, please log in via Github.</span>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <div className={style.buttonsContainer}>
                            <GithubLoginButton githubLogin={this.onGithubLoginButtonClick}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
