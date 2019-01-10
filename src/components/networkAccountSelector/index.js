import React, { Component } from 'react';
import { connect } from 'react-redux';

import style from './style.less';
import { IconDeployGreen } from '../icons';
import OnlyIf from '../onlyIf';
import { NetworkSelector } from './networkSelector';
import { AccountSelector } from './accountSelector';
import { projectActions } from '../../actions/projects.actions';

class NetworkAccountSelector extends Component {
    render() {
        const { selectedProject, onNetworkSelected } = this.props;
        return (
            <OnlyIf test={Boolean(selectedProject.id)}>
                <div className={style.container}>
                    <IconDeployGreen />

                    <NetworkSelector 
                        selectedNetwork={selectedProject.selectedEnvironment}
                        networks={selectedProject.environments}
                        onNetworkSelected={onNetworkSelected} />

                    <div className={style.separator} />

                    <AccountSelector {...this.props} selectedEnvironment={selectedProject.selectedEnvironment.name} />
                </div>
            </OnlyIf>
        );
    }
}

const mapStateToProps = state => ({
    selectedProject: state.projects.selectedProject,
});

const mapDispatchToProps = dispatch => {
    return {
        onNetworkSelected(environment) {
            dispatch(projectActions.setEnvironment(environment));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkAccountSelector);
