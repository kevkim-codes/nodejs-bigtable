// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ** This file is automatically generated by gapic-generator-typescript. **
// ** https://github.com/googleapis/gapic-generator-typescript **
// ** All changes to this file may be overwritten. **



'use strict';

function main(backup, updateMask) {
  // [START bigtableadmin_v2_generated_BigtableTableAdmin_UpdateBackup_async]
  /**
   * This snippet has been automatically generated and should be regarded as a code template only.
   * It will require modifications to work.
   * It may require correct/in-range values for request initialization.
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. The backup to update. `backup.name`, and the fields to be updated
   *  as specified by `update_mask` are required. Other fields are ignored.
   *  Update is only supported for the following fields:
   *   * `backup.expire_time`.
   */
  // const backup = {}
  /**
   *  Required. A mask specifying which fields (e.g. `expire_time`) in the
   *  Backup resource should be updated. This mask is relative to the Backup
   *  resource, not to the request message. The field mask must always be
   *  specified; this prevents any future fields from being erased accidentally
   *  by clients that do not know about them.
   */
  // const updateMask = {}

  // Imports the Admin library
  const {BigtableTableAdminClient} = require('@google-cloud/bigtable').v2;

  // Instantiates a client
  const adminClient = new BigtableTableAdminClient();

  async function callUpdateBackup() {
    // Construct request
    const request = {
      backup,
      updateMask,
    };

    // Run request
    const response = await adminClient.updateBackup(request);
    console.log(response);
  }

  callUpdateBackup();
  // [END bigtableadmin_v2_generated_BigtableTableAdmin_UpdateBackup_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
