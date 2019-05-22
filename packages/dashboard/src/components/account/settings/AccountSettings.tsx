import React, { Component } from 'react';
import Loadable from 'react-loadable';
import Topbar from '../../topbar';
import style from './style.less';
import SideMenu, { SideMenuItem, SideMenuFooter, SideMenuHeader, SideMenuSubHeader } from '../../sideMenu';
import { IconBack, IconArchive, IconUsers } from '../../common/icons';
import { IUser } from '../../../models';
import { EmptyLoading } from '../../common';
import { Switch } from 'react-router';
import PrivateRoute from '../../app/PrivateRoute';
import OnlyIf from '../../common/onlyIf';

const Details = Loadable({
    loader: () => import(/* webpackChunkName: "Details" */'./profile'),
    loading: EmptyLoading,
});

const PeopleList = Loadable({
    loader: () => import(/* webpackChunkName: "PeopleList" */'./themes'),
    loading: EmptyLoading,
});

interface IProps {
    user: IUser;
    location: any;
    match: any;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
}

export default class OrganizationSettings extends Component<IProps> {

    render() {
        const { isAuthenticated, isAuthLoading, user } = this.props;

        return (
            <div className={style.userSettings}>
                <Topbar />
                <div className={style.content}>
                    <SideMenu>
                        <SideMenuHeader title={'Personal Settings'} />
                        <SideMenuSubHeader title={'General'} />
                        <SideMenuItem
                            icon={<IconArchive />}
                            title='Profile'
                            linkTo={'/settings/profile'}
                        />
                        <SideMenuItem
                            icon={<IconUsers />}
                            title='Themes'
                            linkTo={'/settings/people'}
                        />
                        <SideMenuFooter>
                            <SideMenuItem
                                icon={<IconBack />}
                                title='Back to dashboard'
                                linkTo={'/'}
                            />
                        </SideMenuFooter>
                    </SideMenu>
                    <OnlyIf test={!user}>
                        <div className={style.pageContent}>
                            <Switch>
                                <PrivateRoute exact path='/settings/profile' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                    <Details {...props} />
                                )} />
                                <PrivateRoute exact path='/settings/themes' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                    <PeopleList {...props} />
                                )} />
                            </Switch>
                        </div>
                    </OnlyIf>
                </div>
            </div>
        );
    }
}
