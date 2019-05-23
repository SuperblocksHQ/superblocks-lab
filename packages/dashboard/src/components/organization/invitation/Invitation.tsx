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
import { GenericLoading } from '../../common/loadable';
import AcceptInvitation from './acceptInvitation';
import InvitationLogin from './invitationLogin';
import { IInvitationModel } from '../../../models';

interface IProps {
    githubLogin: () => void;
    getInvitationById: (organizationId: string) => void;
    invitation: any;
    acceptInvitation: (invitation: IInvitationModel) => void;
    isLoginInProgress: boolean;
    location: any;
    isAuthenticated: boolean;
    match: any;
}


export default class Invitation extends Component<IProps> {
    state = {
        redirectToReferrer: false,
        invitationId: this.props.match.params.id
    };

    componentDidMount(): void {
        this.props.getInvitationById(this.state.invitationId);
    }

    onGithubLoginButtonClick = () => {
        this.props.githubLogin();
    }

    render() {
        const {invitationId} = this.state;

        const {invitation, acceptInvitation, isAuthenticated, githubLogin, location, isLoginInProgress} = this.props;

        if (!invitation || isLoginInProgress) {
            return <GenericLoading/>;
        }

        if (isAuthenticated) {
            return <AcceptInvitation invitation={invitation} acceptInvitation={acceptInvitation} invitationId={invitationId}/>;
        } else {
            return <InvitationLogin githubLogin={githubLogin} isAuthenticated={isAuthenticated} location={location} invitation={invitation}/>;
        }
    }
}
