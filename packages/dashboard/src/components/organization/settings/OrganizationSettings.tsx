import React, { Component } from 'react';
import Loadable from 'react-loadable';
import Topbar from '../../topbar';
import style from './style.less';
import SideMenu, { SideMenuItem, SideMenuFooter, SideMenuHeader, SideMenuSubHeader } from '../../sideMenu';
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
    organization: IOrganization;
    location: any;
    match: any;
    loadOrganization: (organizationId: string) => void;
    isOrganizationLoading: boolean;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
}

export default class OrganizationSettings extends Component<IProps> {

    componentDidMount() {
        const { match, loadOrganization } = this.props;

        loadOrganization(match.params.organizationId);
    }

    render() {
        const { isAuthenticated, isAuthLoading, isOrganizationLoading, organization } = this.props;

        return (
            <div className={style.organizationSettings}>
                <Topbar organizationId={organization ? organization.id : null} />
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
                    <OnlyIf test={!isOrganizationLoading}>
                        <div className={style.pageContent}>
                            <Switch>
                                <PrivateRoute exact path='/:organizationId/settings/details' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
                                    <Details {...props} />
                                )} />
                                <PrivateRoute exact path='/:organizationId/settings/people' isAuthenticated={isAuthenticated} isLoading={isAuthLoading} render={(props: any) => (
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
