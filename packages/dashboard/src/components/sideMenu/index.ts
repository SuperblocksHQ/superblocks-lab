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

import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { sidemenuActions } from '../../actions';
import { connect } from 'react-redux';
import SideMenu from './sideMenu';

export * from './sideMenuItem';
export * from './sideMenuHeader';
export * from './sideMenuSubHeader';
export * from './sideMenuFooter';
export * from './subMenu';

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        toggleSidemenuInLocalStorage: (collapsed: boolean) => {
            dispatch(sidemenuActions.toggleSidemenuInLocalStorage(collapsed));
        }
    };
};

export default connect(null, mapDispatchToProps)(SideMenu);
