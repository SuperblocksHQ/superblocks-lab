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

import React from 'react';
import Particles, { IParticlesParams } from 'react-particles-js';
import style from './style.less';

const particles: IParticlesParams = {
    particles: {
        number: {
            value: 355,
            density: {
                enable: true,
                value_area: 789.1476416322727
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: 'img/github.svg',
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.48927153781200905,
            random: false,
            anim: {
                enable: true,
                speed: 0.2,
                opacity_min: 0,
                sync: false
            }
        },
        size: {
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0,
                sync: false
            }
        },
        line_linked: {
            enable: false,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 0.2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'bubble'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 83.91608391608392,
                size: 1,
                duration: 3,
                opacity: 1
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
};

export const PageNotFound = () => (
    <div className={style.container}>
        <Particles className={style.particles} params={particles} />
        <div className={style.content}>
            <h1>404</h1>
            <p>These are not the pages you are looking for</p>
            <a href='/dashboard' className='btn2'>Back to Dashboard</a>
        </div>
    </div>
);

export default PageNotFound;
