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
import { Link } from 'react-router-dom';
import PeopleListItem from './PeopleListItem';
import { BreadCrumbs, StyledButton } from '../../../common';
import { IUser, IOrganization } from '../../../../models';
import { StyledButtonType } from '../../../../models/button.model';
import InvitePeopleModal from '../../../modals/invitePeopleModal/InvitePeopleModal';
import OnlyIf from '../../../common/onlyIf';
import classNames from 'classnames';

interface IProps {
    location: any;
    match: any;
    organization: IOrganization;
    userProfile: IUser;
    showInvitePeopleModal: boolean;
    toggleInvitePeopleModal: () => void;

}

export default class PeopleList extends Component<IProps> {
    render() {
        const { showInvitePeopleModal, toggleInvitePeopleModal, organization } = this.props;

        const { members } = organization;

        return (
            <React.Fragment>
                <BreadCrumbs>
                    <Link to={`/${this.props.match.params.organizationId}`}>{organization.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/settings/details`}>Organization Settings</Link>
                    <Link to={window.location.pathname}>People</Link>
                </BreadCrumbs>

                <div className={style.flexVerticalCenter}>
                    <h1>People</h1>
                    <StyledButton type={StyledButtonType.Primary} text={'Invite People'} onClick={() => toggleInvitePeopleModal()} customClassName={style.inviteBtn} />
                </div>

                <OnlyIf test={showInvitePeopleModal}>
                    <InvitePeopleModal hideModal={toggleInvitePeopleModal} />
                </OnlyIf>

                <div className={style.hr}></div>

                <div className={style.peopleList}>
                    <div className={classNames([style.userItem, style.header])}>
                        <div className={style.singleCell}>Name</div>
                        <div className={style.singleCell}>Last seen</div>
                        <div className={style.singleCell}>Role</div>
                        <div className={style.singleCell}>Actions</div>
                    </div>
                    { members.map(user =>
                        <div className={style.userItem} key={user.email}>
                            <PeopleListItem user={user} currentUser={this.props.userProfile} />
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}
