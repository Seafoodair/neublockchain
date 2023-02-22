/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const helper = require('./helper');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class BatchGetAssetWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.chaincodeID = '';
        this.assets = 0;
        this.byteSize = 0;
        this.batchSize = 0;
        this.consensus = false;
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

        const args = this.roundArguments;
        this.chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
        this.assets = args.assets ? parseInt(args.assets) : 0;
        this.batchSize = args.batchSize ? parseInt(args.batchSize) : 1;
        this.byteSize = args.byteSize;
        this.consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;

        const noSetup = args.noSetup ? (args.noSetup === 'true' || args.noSetup === true) : false;
        if (noSetup) {
            console.log('   -> Skipping asset creation stage');
        } else {
            console.log('   -> Entering asset creation stage');
            await helper.addBatchAssets(this.sutAdapter, this.sutContext, this.workerIndex, args);
            console.log('   -> Test asset creation complete');
        }
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        // Create argument array [consensus(boolean), functionName(String), otherArgs(String)]
        const uuids = [];
        for (let i = 0; i < this.batchSize; i++) {
            // take a uuid in the range of known asset numbers
            const uuid = Math.floor(Math.random() * Math.floor(this.assets));
            const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + uuid;
            uuids.push(key);
        }

        const args = {
            contractId: this.chaincodeID,
            contractFunction: 'getAssetsFromBatch',
            contractArguments: [JSON.stringify(uuids)]
        };

        
        if (this.consensus) {
            args.readOnly = false;
        } else {
            args.readOnly = true;
        }

        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new BatchGetAssetWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
