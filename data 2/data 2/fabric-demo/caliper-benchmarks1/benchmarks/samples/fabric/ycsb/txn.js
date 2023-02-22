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
var ds = require('discrete-sampling');
var prob = require('prob.js');



/**
 * Workload module for the benchmark round.
 */
class CreateCarWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txnPerBatch;
        this.recordCount;
        this.readRatio;
        this.insertRatio;
        this.updateRatio;
        this.deleteRatio;
        this.modifyRatio;
        this.lqueryRatio;
        this.distribution;
        this.operation_type = ['insert', 'update', 'remove', 'readmodifywrite', 'lquery'];
        this.uniform_sampler;
        this.zipf_sampler;
        this.discrete_sampler;
    }

    buildKey(recordIdx) {
        let recordIdxStr = recordIdx.toString();

        let paddingLen = 16 - recordIdxStr.length;
        let key = "user";
        for (let i = 0; i < paddingLen; ++i) {
            key += "0";
        }

        key += recordIdxStr;

        return key;
    }

    buildValue() {
        let value = '';
        // console.log("fieldCount: ", fieldCount, " fieldLength: ", fieldLength);
        for (let i = 0;i < 10; i++) {
            value += "field" + i.toString() + "=" + this.random_string(10) + " ";
        }
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
    
    nextKey() {
        let key = 0;
        if (this.distribution === "uniform") {
            key = Math.floor(this.uniform_sampler())
        } else if (this.distribution === "zipf") {
            key = Math.floor(this.zipf_sampler() - 1);
        } else {
            throw new Error('No Other distribution allowed. ');
        }
        //console.log("Selected key: ", key);
        return this.buildKey(key);
    }
    inRange(ratio) {
        return -0.01 <= ratio && ratio <= 1.01;
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        // if (!this.roundArguments.hasOwnProperty('txnPerBatch')) {
        //     return Promise.reject(new Error('ycsb.txn - \'txnPerBatch\' is missed in the arguments'));
        // }
        this.txnPerBatch = this.roundArguments.txnPerBatch;

        // if (!this.roundArguments.hasOwnProperty('readRatio') || !inRange(this.roundArguments.readRatio)) {
        //     return Promise.reject(new Error('ycsb.txn - \'readRatio\' is missed in the arguments or not in the correct range.'));
        // }
        this.readRatio = this.roundArguments.readRatio;

        // if (!this.roundArguments.hasOwnProperty('insertRatio') || !inRange(this.roundArguments.insertRatio)) {
        //     return Promise.reject(new Error('ycsb.txn - \'insertRatio\' is missed in the arguments or not in the correct range.'));
        // }
        this.insertRatio = this.roundArguments.insertRatio;

        // if (!this.roundArguments.hasOwnProperty('updateRatio') || !inRange(this.roundArguments.updateRatio)) {
        //     return Promise.reject(new Error('ycsb.txn - \'updateRatio\' is missed in the arguments or not in the correct range.'));
        // }
        this.updateRatio = this.roundArguments.updateRatio;

        // if (!this.roundArguments.hasOwnProperty('deleteRatio') || !inRange(this.roundArguments.deleteRatio)) {
        //     return Promise.reject(new Error('ycsb.txn - \'deleteRatio\' is missed in the arguments or not in the correct range.'));
        // }
        this.deleteRatio = this.roundArguments.deleteRatio;

        // if (!this.roundArguments.hasOwnProperty('modifyRatio') || !inRange(this.roundArguments.modifyRatio)) {
        //     return Promise.reject(new Error('ycsb.txn - \'modifyRatio\' is missed in the arguments or not in the correct range.'));
        // }
        this.modifyRatio = this.roundArguments.modifyRatio;

        // this.lqueryRatio = this.roundArguments.lqueryRatio;
        if (this.roundArguments.hasOwnProperty('lqueryRatio')) {
            if (this.inRange(this.roundArguments.lqueryRatio)) {
                this.lqueryRatio = this.roundArguments.lqueryRatio;
            } else {
                return Promise.reject(new Error('lqueryRatio ' + this.roundArguments.lqueryRatio + " is invalid..."));
            }
        } else {
            this.lqueryRatio = 0;
        }

        let totalRatio = this.readRatio + this.insertRatio + this.updateRatio + this.deleteRatio + this.modifyRatio + this.lqueryRatio;
        if (!(0.999 <= totalRatio && totalRatio <= 1.0001)) {
            return Promise.reject(new Error('ycsb.txn - The ratio is not normalized. '));
        }


        // if (!this.roundArguments.hasOwnProperty('recordCount')) {
        //     return Promise.reject(new Error('ycsb.txn - \'recordCount\' is missed in the arguments.'));
        // }
        this.recordCount = this.roundArguments.recordCount;


        // if (!this.roundArguments.hasOwnProperty('distribution')) {
        //     return Promise.reject(new Error('ycsb.txn - \'distribution\' is missed in the arguments.'));
        // }
        this.distribution = "zipf";

        this.discrete_sampler = ds.Discrete([this.insertRatio, this.updateRatio, this.deleteRatio, this.modifyRatio, this.lqueryRatio]);
        // this.zipf_sampler = prob.zipf(this.roundArguments.zipf_s, this.recordCount);
//        this.uniform_sampler = prob.uniform(0, this.recordCount);
        if (this.distribution === "zipf") {
            if (!this.roundArguments.hasOwnProperty('zipf_s')) {
                return Promise.reject(new Error('ycsb.txn - \'zipf_s\' is missed in the arguments.'));
            } else {
                this.zipf_sampler = prob.zipf(this.roundArguments.zipf_s, this.recordCount);
            }
        } else if (this.thisdistribution === "uniform") {
            this.uniform_sampler = prob.uniform(0, this.recordCount);
        } else {
            throw new Error('No other distribution allowed. ');
        }
    }
    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let prob = Math.random();
        // console.log("read ratio ", readRatio, " prob ", prob)
        if (prob < this.readRatio) {
            let read_promises = [];
            for (let i = 0; i < this.txnPerBatch; ++i) {
                let key = this.nextKey();
                // console.log("Queried Key: ", key);
                let args = {
                    contractId: 'ycsb',
                    contractVersion: 'v1',
                    contractFunction: 'query',
                    contractArguments: [key],
                    timeout: 30
                };
                read_promises.push(args);
            }
            await this.sutAdapter.sendRequests(read_promises);
        } else {
            let workload = [];

            for (let j = 0; j < this.txnPerBatch; j++) {
                let op = this.operation_type[this.discrete_sampler.draw()];
                let key = this.nextKey();
                let op_payload;
                switch (op) {
                    case 'insert':
                        {
                            throw new Error('Not implemented for Insert!');
                            break;
                        }
                    case 'update':
                    case 'readmodifywrite':
                        {
                            // console.log("Updated Key: ", key);
                            op_payload = {
                                contractId: 'ycsb',
                                contractVersion: 'v1',
                                contractFunction: op,
                                contractArguments: [key, this.buildValue()],
                                timeout: 30
                            };
                            break;
                        }
                    case 'remove':
                        {
                            op_payload = {
                                contractId: 'ycsb',
                                contractVersion: 'v1',
                                contractFunction: op,
                                contractArguments: [key],
                                timeout: 30
                            };
                            break;
                        }
                    case 'lquery':
                        {
                            op_payload = {
                                contractId: 'ycsb',
                                contractVersion: 'v1',
                                contractFunction: 'query',
                                contractArguments: [key],
                                timeout: 30
                            };
                            // console.log("Issue a lquery...");
                            break;
                        }
                    default:
                        {
                            throw new Error('Invalid operation!!!');
                        }
                }
                workload.push(op_payload); 
            }
            await this.sutAdapter.sendRequests(workload);
        }
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

