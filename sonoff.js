#!/usr/bin/env node
const fishingrod = require('fishingrod');
const help = require('./actions/help');
const actions = require('./actions/actions');
const optionParser = require('./actions/parser');

let args = process.argv.slice(2);

let { options, variables } = optionParser(args);
let action = variables[0];

if(options.help || options.h) {
	return help();
}

if(options.version || options.v) {
	const version = require('./package.json').version;
	console.log(`Sonoff version`, version);
	return process.exit(0);
}

if(!action) {
	console.error('Please specify an action');
	return process.exit(1);
}

return actions(action, options);
