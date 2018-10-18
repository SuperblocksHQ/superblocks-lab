// Copyright 2018 Superblocks AB
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

import { h, Component } from 'preact';

export class FadeInComponent extends Component {
    state = {
        animate: false
    }

    componentDidMount() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.setState({ animate: true });
            });
        });
    } 

    render() {
        return(
            <div style={{
                opacity: this.state.animate ? 1 : 0,
                transition: 'opacity .3s',
            }}>
                { this.props.children }
            </div>
        );
    }
}