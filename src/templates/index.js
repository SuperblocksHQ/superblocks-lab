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

const EmptyZip = require('../assets/static/templates/empty.zip');
const HelloZip = require('../assets/static/templates/hello.zip');
const NewsZip = require('../assets/static/templates/newsfeed.zip');
const RaiseZip = require('../assets/static/templates/raisetosummon.zip');
const VotingZip = require('../assets/static/templates/voting.zip');
const SafeMathZip = require('../assets/static/templates/safemath.zip');
const ERC20TokenZip = require('../assets/static/templates/erc-20-token.zip');

export default class Templates {
    static categories = [
        {
            id: 0,
            name: 'All',
        },
        {
            id: 1,
            name: 'Crowdfunding',
        },
        {
            id: 2,
            name: 'Generic',
        },
        {
            id: 3,
            name: 'Introduction',
        },
        {
            id: 4,
            name: 'Math',
        },
    ];

    static templates = [
        {
            "id": 0,
            "name": "Empty Project",
            "description": "Empty project",
            "image": "/static/img/templates/img-empty.png",
            "categories": [0, 2],
            "zip": EmptyZip,
        },
        {
            "id": 1,
            "name": "Hello World",
            "description": "Simple Hello World starter project",
            "image": "/static/img/templates/img-hello-world.png",
            "categories": [0, 3],
            "zip": HelloZip,
        },
        {
            "id": 2,
            "name": "Uncensorable News Feed",
            "description": "Publish news that nobody can censor",
            "image": "/static/img/templates/img-news-feed.png",
            "categories": [0, 2],
            "zip": NewsZip,
        },
        {
            "id": 3,
            "name": "Raise to Summon",
            "description": "Raise Funds to summon a V.I.P. to a meetup/conference/hackathon",
            "image": "/static/img/templates/img-raise-to-summon.png",
            "categories": [0, 1],
            "zip": RaiseZip,
        },
        {
            "id": 4,
            "name": "Voting System",
            "description": "Simple voting system that you can tweak according to your needs",
            "image": "/static/img/templates/img-voting-system.png",
            "categories": [0, 2],
            "zip": VotingZip,
        },
        {
            "id": 5,
            "name": "SafeMath",
            "description": "Math operations with safety checks",
            "image": "/static/img/templates/img-safemath.png",
            "categories": [0, 4],
            "zip": SafeMathZip,
        },
        {
            "id": 6,
            "name": "ERC-20 Token",
            "description": "Example DApp which uses ERC-20 standard",
            "image": "/static/img/templates/img-erc20-token.png",
            "categories": [0, 2],
            "zip": ERC20TokenZip,
        },
    ];
}
