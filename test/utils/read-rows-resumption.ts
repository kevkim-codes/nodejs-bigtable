// Copyright 2024 Google LLC
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

import {describe, it} from 'mocha';
import {ChunkTransformer} from '../../src/chunktransformer';
import {ReadRowsResumptionStrategy} from '../../src/utils/read-rows-resumption';
import * as assert from 'assert';
import {GoogleError} from 'google-gax';

describe('Bigtable/Utils/ReadrowsResumptionStrategy', () => {
  const tableName = 'fake-table-name';
  [
    {
      name: 'should generate the right resumption request with no options each time',
      expectedResumeRequest: {
        rows: {
          rowKeys: [],
          rowRanges: [{}],
        },
        tableName,
      },
      options: {},
    },
    {
      name: 'should generate the right resumption requests with a last row key',
      expectedResumeRequest: {
        rows: {
          rowKeys: ['c'].map(key => Buffer.from(key)),
          rowRanges: [],
        },
        tableName,
      },
      options: {
        keys: ['a', 'b', 'c'],
      },
      lastRowKey: 'b',
    },
    {
      name: 'should generate the right resumption request with the lastrow key in a row range',
      expectedResumeRequest: {
        rows: {
          rowKeys: [],
          rowRanges: [
            {startKeyOpen: Buffer.from('b'), endKeyClosed: Buffer.from('c')},
            {startKeyClosed: Buffer.from('e'), endKeyClosed: Buffer.from('g')},
          ],
        },
        tableName,
      },
      options: {
        ranges: [
          {start: 'a', end: 'c'},
          {start: 'e', end: 'g'},
        ],
      },
      lastRowKey: 'b',
    },
    {
      name: 'should generate the right resumption request with the lastrow key at the end of a row range',
      expectedResumeRequest: {
        rows: {
          rowKeys: [],
          rowRanges: [
            {startKeyClosed: Buffer.from('e'), endKeyClosed: Buffer.from('g')},
          ],
        },
        tableName,
      },
      options: {
        ranges: [
          {start: 'a', end: 'c'},
          {start: 'e', end: 'g'},
        ],
      },
      lastRowKey: 'c',
    },
    {
      name: 'should generate the right resumption request with start and end',
      expectedResumeRequest: {
        rows: {
          rowKeys: [],
          rowRanges: [
            {
              startKeyOpen: Buffer.from('d'),
              endKeyClosed: Buffer.from('m'),
            },
          ],
        },
        tableName,
      },
      options: {
        start: 'b',
        end: 'm',
      },
      lastRowKey: 'd',
    },
    {
      name: 'should generate the right resumption request with prefixes',
      expectedResumeRequest: {
        rows: {
          rowKeys: [],
          rowRanges: [
            {
              startKeyClosed: Buffer.from('f'),
              endKeyOpen: Buffer.from('g'),
            },
            {
              startKeyClosed: Buffer.from('h'),
              endKeyOpen: Buffer.from('i'),
            },
          ],
        },
        tableName,
      },
      options: {
        prefixes: ['d', 'f', 'h'],
      },
      lastRowKey: 'e',
    },
  ].forEach(test => {
    it(test.name, () => {
      const chunkTransformer = new ChunkTransformer({
        decode: false,
      } as any);
      if (test.lastRowKey) {
        chunkTransformer.lastRowKey = test.lastRowKey;
      }
      const strategy = new ReadRowsResumptionStrategy(
        chunkTransformer,
        test.options,
        {
          tableName,
        }
      );
      strategy.canResume(new GoogleError()); // Updates strategy state.
      // Do this check 2 times to make sure getResumeRequest is idempotent.
      assert.deepStrictEqual(
        strategy.getResumeRequest(),
        test.expectedResumeRequest
      );
      assert.deepStrictEqual(
        strategy.getResumeRequest(),
        test.expectedResumeRequest
      );
    });
  });
  it('should generate the right resumption request with the limit', () => {
    const chunkTransformer = new ChunkTransformer({
      decode: false,
    } as any);
    const strategy = new ReadRowsResumptionStrategy(
      chunkTransformer,
      {
        limit: 71,
      },
      {
        tableName,
      }
    );
    strategy.rowsRead = 37;
    strategy.canResume(new GoogleError()); // Updates strategy state.
    assert.deepStrictEqual(strategy.getResumeRequest(), {
      rows: {
        rowKeys: [],
        rowRanges: [{}],
      },
      rowsLimit: 34,
      tableName,
    });
  });
});