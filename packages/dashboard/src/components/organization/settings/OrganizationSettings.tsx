import React, { Component } from 'react';
import Loadable from 'react-loadable';
import Topbar from '../../topbar';
import style from './style.less';
import { SideMenu, SideMenuItem, SideMenuFooter, SideMenuHeader, SideMenuSubHeader } from '../../sideMenu';
import { IconBack, IconArchive, IconUsers } from '../../common/icons';
import { IOrganization } from '../../../models';
import { EmptyLoading } from '../../common';
import { Switch } from 'react-router';
import PrivateRoute from '../../app/PrivateRoute';
import OnlyIf from '../../common/onlyIf';


const Details = Loadable({
    loader: () => import(/* webpackChunkName: "Details" */'./details'),
    loading: EmptyLoading,
});

const PeopleList = Loadable({
    loader: () => import(/* webpackChunkName: "PeopleList" */'./people'),
    loading: EmptyLoading,
});

interface IProps {
    location: any;
    match: any;
    content: JSX.Element;
    organizationList: [IOrganization];
    loadUserOrganizationList: () => void;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
}

export default class OrganizationSettings extends Component<IProps> {

    componentDidMount() {
        this.props.loadUserOrganizationList();
    }

    getOrganization() {
        return this.props.organizationList.find((org) =>
            org._id === this.props.match.params.organizationId
        );
    }

    render() {
        const { isAuthenticated, isAuthLoading } = this.props;
        const organization = this.getOrganization();

        return (
            <div className={style.organizationSettings}>
                <Topbar />
                <div className={style.content}>
                    <SideMenu>
                        <SideMenuHeader title={'Organization Settings'} />
                        <SideMenuSubHeader title={'General'} />
                        <SideMenuItem
                            icon={<IconArchive />}
                            title='Details'
                            linkTo={`/${this.props.match.params.organizationId}/settings/details`}
                        />
                        <SideMenuItem
                            icon={<IconUsers />}
                            title='People'
                            linkTo={`/${this.props.match.params.organizationId}/settings/people`}
                        />
                        <SideMenuFooter>
                            <SideMenuItem
                                icon={<IconBack />}
                                title='Back to dashboard'
                                linkTo={`/${this.props.match.params.organizationId}`}
                            />
                        </SideMenuFooter>
                    </SideMenu>
                    <div className={style.pageContent}>
                        <OnlyIf test={!!organization}>
                            <Switch>
                                <PrivateRoute exact path='/:organizationId/settings/details' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                    <Details {...props} organization={organization} />
                                )} />
                                <PrivateRoute exact path='/:organizationId/settings/people' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                    <PeopleList {...props} organization={organization} />
                                )} />
                            </Switch>
                        </OnlyIf>
                    </div>
                </div>
            </div>
        );
    }
}
