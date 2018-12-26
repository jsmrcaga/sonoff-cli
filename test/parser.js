const expect = require('chai').expect;
const parser = require('../actions/parser');

describe('Option parser tests', () => {
	it('Should return an empty object if no options passed', () => {
		const options = [];
		const result = {};

		expect(parser(options).options).to.be.eql(result);
	});

	it('Should parse a single option without value', () => {
		const options = ['-v'];
		const result = {
			v: true
		};

		expect(parser(options).options).to.be.eql(result);
	});

	it('Should parse options without value & a variable', () => {
		const options = ['show', '-v'];
		const resultOptions = {
			v: true
		};

		const resultVariables = ['show'];

		const parsed = parser(options);
		expect(parsed.options).to.be.eql(resultOptions);
		expect(parsed.variables).to.be.eql(resultVariables);
	});

	it('Should parse a single option with value (!=)', () => {
		const options = ['-v', '0.0.0'];
		const result = {
			v: '0.0.0'
		};

		expect(parser(options).options).to.be.eql(result);
	});

	it('Should parse a single option with value (=)', () => {
		const options = ['-v=0.0.0'];
		const result = {
			v: '0.0.0'
		};

		expect(parser(options).options).to.be.eql(result);
	});

	it('Should pare multiple options with value', () => {
		const options = ['-v=0.0.0', '-p=56', '--version', '89', '--plep=57'];
		const result = {
			v: '0.0.0',
			p: '56',
			version: '89',
			plep: '57'
		};

		expect(parser(options).options).to.be.eql(result);
	});

	it('Should parse multiple option without value', () => {
		const options = ['-v', '-p', '--version'];
		const result = {
			v: true,
			p: true,
			version: true
		};

		expect(parser(options).options).to.be.eql(result);
	});

	it('Should parse multiple options with & without value', () => {
		const options = ['-v=0.0.0', '-p', '--version', '89', '--plep', '--plop'];
		const result = {
			v: '0.0.0',
			p: true,
			version: '89',
			plep: true,
			plop: true
		};

		expect(parser(options).options).to.be.eql(result);
	});
});
