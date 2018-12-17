// lib/debuggers.js
const debug = require('debug');

exports.init = debug('app:init');
exports.menu = debug('app:menu');
exports.db = debug('app:database');
exports.http = debug('app:http');
exports.testConsole=debug('app:testConsole');
