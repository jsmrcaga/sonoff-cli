const sonoff = '10.10.7.1';
const fishingrod = require('fishingrod');
const URL = require('url');

const requires = function(action, requiredOptions = [], maybeOptions = [], options = []) {
	let given = Object.keys(options);
	requiredOptions.forEach(opt => {
		if(given.indexOf(opt) === -1) {
			console.error(`Action ${action} requires options: `, requiredOptions.map(o => `-${o}`).join(', '), 'missing', `-${opt}`);
			return process.exit(1);
		}
	});

	maybeOptions.forEach(opt => {
		if(given.indexOf(opt) === -1) {
			console.warn(`It is recommended to also use option -${opt} for action ${action}`);
		}
	});
};

const actions = {};

actions['auto'] = function(options) {
	requires('auto', ['w', 's'], ['o'], options);

	// SET INGO
	let [ssid, password] = options.w.split(':');
	let [wsServer, wsPort] = options.s.split(':');

	console.log('Will configure SOnOff device with:\n',
		'SSID:              ', ssid, '\n',
		'Password:          ', password, '\n',
		'Websocket server:  ', wsServer, '\n',
		'Port:              ', wsPort, '\n');

	// Device info
	let device = null;

	console.log('Getting device information first...');

	fishingrod.fish({
		host: sonoff,
		path: '/device',
		timeout: 1000
	}).then(res => {
		if(res.status !== 200) {
			console.error('Could not get device info', res.status, res.response);
			return process.exit(1);
		}

		let response = JSON.parse(res.response);
		device = {
			id: response.deviceid,
			api_key: response.apikey
		};

		console.log('Got Sonoff device info!', device);

		let apinfo = {
			version: 4,
			ssid,
			password,
			serverName: wsServer,
			port: parseInt(wsPort)
		};

		console.log('Setting sonoff device AP info...', apinfo);
		return fishingrod.fish({
			method: 'POST',
			host: sonoff,
			path: '/ap',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(apinfo),
			timeout: 10000
		});

	}).then(res => {
		if(res.status !== 200) {
			console.error('Device could not be configured', res.status, res.response);
			return process.exit(1);
		}

		console.log('********************************');
		console.log('Device configured successfully!!');
		console.log('********************************');

		if(options.o) {
			console.log('\n Sending result to desired output:', options.o)
			let url = URL.parse(options.o);

			return fishingrod.fish({
				https: url.protocol === 'https:',
				method: 'POST',
				host: url.hostname,
				port: url.port,
				path: url.path
			}).then(res => {
				console.log('********************************');
				console.log('Output response was: (', res.status, ')');
				console.log(res.headers);
				console.log(res.response);
				console.log('********************************');
			}).catch(e => {
				console.error('Could not send output to server', e);
			});
		}

	}).catch(e => {
		console.error('Could not configure device properly', e);
		process.exit(1);
	});
};

module.exports = function(action, options) {
	if(!actions[action]) {
		console.error(`Action ${action} does not exist`);
		return process.exit(1);
	}

	return actions[action](options);
};
