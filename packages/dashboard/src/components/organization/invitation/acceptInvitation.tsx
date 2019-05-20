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
import classNames from 'classnames';
import style from './style.less';
import { StyledButtonType, IInvitationModel } from '../../../models';
import { StyledButton } from '../../common/buttons';

interface IProps {
    invitation: IInvitationModel;
    acceptInvitation: (invitation: IInvitationModel) => void;
    invitationId: string;
}

export default class AcceptInvitation extends Component<IProps> {

    render() {
        const {invitation, acceptInvitation } = this.props;

        return (
            <div className={classNames([style.loginModal, 'modal'])}>
                <div className={style.container}>
                    <div className={style.area}>
                        <div className={style.headerText}>
                            <span>You have been invited to join {invitation.organizationName}</span>
                        </div >
                        <div className={style.promoText}>
                            <span>Click on the button below to accept the invitation!</span>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <div className={style.buttonsContainer}>
                            <StyledButton type={StyledButtonType.Primary} onClick={() => acceptInvitation(invitation)} text='Accept invitation' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
