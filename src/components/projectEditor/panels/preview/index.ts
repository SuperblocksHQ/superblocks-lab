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

import { Preview } from './Preview';
import { connect } from 'react-redux';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { projectSelectors } from '../../../../selectors';

const mapStateToProps = (state: any) => ({
    project: projectSelectors.getProject(state),
    disableAccounts: state.preview.disableAccounts,
    showNoExportableContentModal: state.preview.showNoExportableContentModal,
    showCannotExportModal: state.preview.showCannotExportModal,
    showDownloadModal: state.preview.showDownloadModal,
    selectedEnvironment: projectSelectors.getSelectedEnvironment(state),
    selectedAccount: projectSelectors.getSelectedAccount(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        onDownload: () => {
            // dispatch(outputLogActions.clearOutputLog());
        },
        onTryDownload: () => {
            // dispatch(outputLogActions.clearOutputLog());
        },
        onToggleWeb3Accounts: () => {
            // dispatch(outputLogActions.clearOutputLog());
        },
        onHideModals: () => {
            // dispatch(outputLogActions.clearOutputLog());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
