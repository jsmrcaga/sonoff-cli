const isOption = (arg) => /^--/.test(arg) || /^-/.test(arg);
const getOptionName = (arg) => arg.replace(/-(-)?/g, '');

module.exports = function(args) {
	let options = {};
	let variables = [];

	for(let i = 0; i < args.length; i++) {
		let arg = args[i];

		if(isOption(arg)) {

			if(arg.indexOf('=') > -1) {
				let [option, value] = arg.split('=');
				options[getOptionName(option)] = value;

			} else {
				if(!args[i+1] || isOption(args[i+1])) {
					options[getOptionName(arg)] = true;

				} else {
					options[getOptionName(arg)] = args[i+1];
					i++;

				}
			}

		} else {
			variables.push(arg);
		}
	}

	return {
		options,
		variables
	};
};
