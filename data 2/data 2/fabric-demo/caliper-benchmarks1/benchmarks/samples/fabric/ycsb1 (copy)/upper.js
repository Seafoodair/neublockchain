/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const colors = ['blue', 'red', 'green', 'yellow', 'black', 'purple', 'white', 'violet', 'indigo', 'brown'];

/**
 * Workload module for the benchmark round.
 */
class CreateCarWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        this.txIndex++;
        let tx1 = this.txIndex + 1;
        let tx2 = this.txIndex + 2;
        let tx3 = this.txIndex + 3;
        let tx4 = this.txIndex + 4;
        let tx5 = this.txIndex + 5;
        let tx6 = this.txIndex + 6;
        let tx7 = this.txIndex + 7;
        let tx8 = this.txIndex + 8;
        let key = 'Client_' + this.workerIndex + '_'+ this.txIndex.toString();
        let key1 = 'Client_' + this.workerIndex + '_'+ tx1.toString();
        let key2 = 'Client_' + this.workerIndex + '_'+ tx2.toString();
        let key3 = 'Client_' + this.workerIndex + '_'+ tx3.toString();
        let key4 = 'Client_' + this.workerIndex + '_'+ tx4.toString();
        let key5 = 'Client_' + this.workerIndex + '_'+ tx5.toString();
        let key6 = 'Client_' + this.workerIndex + '_'+ tx6.toString();
        let key7 = 'Client_' + this.workerIndex + '_'+ tx7.toString();
        let key8 = 'Client_' + this.workerIndex + '_'+ tx8.toString();
	this.txIndex = this.txIndex+9
        let args1 = {
            contractId: 'ycsb',
            contractVersion: 'v1',
            contractFunction: 'upper',
            contractArguments: ['1', key],
            timeout: 30
        };
        let args2 = {
            contractId: 'ycsb',
            contractVersion: 'v1',
            contractFunction: 'upper',
            contractArguments: [3, key, key1, key2],
            timeout: 30
        };
        let args3 = {
            contractId: 'ycsb',
            contractVersion: 'v1',
            contractFunction: 'upper',
            contractArguments: [5, key, key1, key2, key3, key4],
            timeout: 30
        };
        let args4 = {
            contractId: 'ycsb',
            contractVersion: 'v1',
            contractFunction: 'upper',
            contractArguments: [7, key, key1, key2,key3, key4, key5,key6],
            timeout: 30
        };
        let args5 = {
            contractId: 'ycsb',
            contractVersion: 'v1',
            contractFunction: 'upper',
            contractArguments: [9, key, key1, key2,key3, key4, key5,key6,key7,key8],
            timeout: 30
        };
        let args = [args1, args2, args3, args4, args5];
        let value = args[Math.floor(Math.random() * args.length)];

        await this.sutAdapter.sendRequests(value);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new CreateCarWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
