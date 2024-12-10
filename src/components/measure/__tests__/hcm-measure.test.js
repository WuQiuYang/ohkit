'use strict';

const hcmMeasure = require('../src/measure');
const assert = require('assert').strict;

assert.strictEqual(hcmMeasure(), 'Hello from hcmMeasure');
console.info("hcmMeasure tests passed");
