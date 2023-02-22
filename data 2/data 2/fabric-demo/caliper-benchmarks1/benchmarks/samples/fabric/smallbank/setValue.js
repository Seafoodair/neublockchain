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

const initial = 1000000
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
     //[customer_id, customer_name, initial_checking_balance, initial_savings_balance]
    async submitTransaction() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (let i = 0; i < 12; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        this.txIndex++;
        let customer_id = 'Client_' + this.txIndex.toString();
        let customer_name = text;
        let initial_checking_balance = initial;
        let initial_savings_balance = initial;

        let args = {
            contractId: 'smallbank',
            contractVersion: 'v1',
            contractFunction: 'create_account',
            contractArguments: [customer_id, customer_name, initial_checking_balance, initial_savings_balance],
            timeout: 30
        };
	
        await this.sutAdapter.sendRequests(args);
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

