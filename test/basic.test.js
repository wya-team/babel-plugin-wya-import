const fs = require('fs');
const { resolve } = require('path');
const vcLoader = require('../src/loader');

let source = fs.readFileSync(resolve(__dirname, '../example/example.vue'), 'utf8');

test('basic', () => {
	let code = vcLoader(source);
	expect(code).toMatchSnapshot();

	console.log(code);
});