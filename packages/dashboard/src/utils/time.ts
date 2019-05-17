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

/**
 * Function to transform seconds to the format hh:mm:ss
 * @param d - Time represented in seconds to be converted
 */
export function secondsToHms(d: number) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h < 10 ? '0' + h : h : '00';
    const mDisplay = m > 0 ? m < 10 ? '0' + m : m : '00';
    const sDisplay = s > 0 ? s < 10 ? '0' + s : s : '00';
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
}
