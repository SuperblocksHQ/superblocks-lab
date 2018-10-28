// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import ABI from '../../ethereumjs-abi-0.6.5.min.js';


//
// External helper functions
// Note: this is a set of functions offered as a library extension to aid users writing tests
export default class TestLibrary {
    constructor() {

    }

    assert_call=(instance, address, method, args, expectedType, expectedValue, done)=> {
        // TODO: FIXME: error handling
        var data_name=ABI.ABI.methodID(method, args);
        var expectedValue="0x" + ABI.ABI.rawEncode(expectedType, expectedValue).toString("hex");
        it('matches data', function (done) {
            instance._eth.call({to: address, data: data_name}, function(error, result) {
                if(!error) {
                    console.warn(result);
                    console.warn(expectedValue);
                    if(result !== expectedValue) {
                        done(new Error(result));
                    } else {
                        done();
                    }
                } else {
                    done(new Error(error));
                }
            });
        });
    }
}
