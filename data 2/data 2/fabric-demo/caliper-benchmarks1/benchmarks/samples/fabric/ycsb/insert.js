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
var crypto = require('crypto');

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class CreateCarWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        // this.txIndex = 0;
        this.recordStartIdx = 0;
        this.firedTxnCount = 0;
        this.recordCount = 0;
        this.txnPerBatch = 1;
        this.orderedinserts = false;
        this.fieldCount = 10;
        this.fieldLength = 10;
    }
      /**
     * Initialize the workload module with the given parameters.
     * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
     * @param {number} totalWorkers The total number of workers participating in the round.
     * @param {number} roundIndex The 0-based index of the currently executing round.
     * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
     * @param {BlockchainInterface} sutAdapter The adapter of the underlying SUT.
     * @param {Object} sutContext The custom context object provided by the SUT adapter.
     * @async
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        // if(!this.roundArguments.hasOwnProperty('txnPerBatch')) {
        //     return Promise.reject(new Error('ycsb.insert - \'txnPerBatch\' is missed in the arguments'));
        // }
        // this.txnPerBatch = this.roundArguments.txnPerBatch;
        // console.log("txnPerBatch: " + this.txnPerBatch);
        // if(!this.roundArguments.hasOwnProperty('orderedInserts')) {
        //     this.orderedinserts = false;
        // } else {
        //     this.orderedinserts = true;
        // }

        // if(!this.roundArguments.hasOwnProperty('fieldCount')) {
        //     return Promise.reject(new Error('ycsb.insert - \'fieldCount\' is missed in the arguments'));
        // }
        this.fieldCount = this.roundArguments.fieldCount;
        // console.log("fieldCount: " + this.fieldCount);
        // if(!this.roundArguments.hasOwnProperty('fieldLength')) {
        //     return Promise.reject(new Error('ycsb.insert - \'fieldLength\' is missed in the arguments'));
        // }
        this.fieldLength = this.roundArguments.fieldLength;
        // console.log("fieldLength: " + this.fieldLength);
        this.recordStartIdx = this.workerIndex * 1200;
        console.log("recordStartIdx: " + this.recordStartIdx);
        this.recordCount = 1200;
        console.log("recordCount: " + this.recordCount);
    }

    buildKey(recordIdx) {
        let recordIdxStr = recordIdx.toString();

        let paddingLen = 16 - recordIdxStr.length;
        let key = "user";
        for (let i = 0;i < paddingLen; ++i) {
            key += "0";
        }

        key += recordIdxStr;

        if (this.orderedinserts) {
            return key;
        } else {
            return crypto.createHash('md5').update(key).digest('hex');
        }
    }

    buildValue() {
        let value = '';
        for (let i = 0;i < this.fieldCount; i++) {
            value += "field" + i.toString() + "=" + this.random_string(this.fieldLength) + " ";
        }
        // console.log("fieldCount: ", this.fieldCount, " fieldLength: ", this.fieldLength);
        return value;
    }

    random_string(len) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < len; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let workload = [];
        for(let i= 0; i < this.txnPerBatch && this.firedTxnCount < this.recordCount; i++, this.firedTxnCount++) {
            let key = this.buildKey(this.recordStartIdx + this.firedTxnCount);
            let val = this.buildValue();
            let args = {
                contractId: 'ycsb',
                contractVersion: 'v1',
                contractFunction: 'insert',
                contractArguments: [key, val],
                timeout: 30
            };
            workload.push(args);
        }
        await this.sutAdapter.sendRequests(workload);
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
