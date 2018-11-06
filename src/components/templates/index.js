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

const Empty = require('./empty.json');
const HelloWorld = require('./hello.json');
const NewsFeed = require('./newsfeed.json');
const RaiseToSummon = require('./raisetosummon.json');
const EmptyZip = require('./empty.zip');
const HelloZip = require('./hello.zip');
const NewsZip = require('./newsfeed.zip');
const RaiseZip = require('./raisetosummon.zip');

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
            "description": "Simple Hello World starter",
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
    ];
}
