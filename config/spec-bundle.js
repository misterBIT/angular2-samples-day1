Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');

// Typescript emit helpers polyfill
require('ts-helpers');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('zone.js/dist/sync-test');
require('zone.js/dist/proxy'); // since zone.js 0.6.15
require('zone.js/dist/jasmine-patch'); // put here since zone.js 0.6.14

// RxJS
require('rxjs/Rx');

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');

function requireAll(requireContext) {
	return requireContext.keys().map(requireContext);
}

testing.TestBed.initTestEnvironment(
	browser.BrowserDynamicTestingModule,
	browser.platformBrowserDynamicTesting()
);

const testContext = require.context('../src', true, /\.spec\.ts/);
requireAll(testContext);