"use strict";

const loaderUtils = require('loader-utils');

const dash2camel = (str) => {
	let arr = str.split("-");

	for (let i = 0; i < arr.length; i++) {
		arr[i] = `${arr[i].charAt(0).toUpperCase()}${arr[i].substring(1)}`;
	}
	return arr.join('')
}


module.exports = function(source) {
	const options = loaderUtils.getOptions(this);

	this.cacheable();

	let newSource = source;

	let target = source.match(/<vcm?-([a-z]+)([^\s>\/])/g).reduce((pre, cur, index, source) => {

		if (source.indexOf(cur) === index) {
			let dash = cur.replace(/(<vc-?|\s)/g, '');

			pre.push({
				dash,
				camel: dash2camel(dash)
			})
		};

		return pre;
	}, []);

	let content = target.reduce((pre, cur) => {
		return {
			imports: pre.imports + `import ${cur.camel} from 'wya-vc/lib/${cur.dash}';\n`,
			components: pre.components + `		'${cur.dash.includes('m-') ? 'vc' : 'vc-'}${cur.dash}': ${cur.camel},\n`
		}
	}, {
		imports: '\n',
		components: '\n'
	})

	let codeSplit;

	codeSplit = newSource.split('<script>');

	newSource = codeSplit[0] + '<script>' + content.imports + codeSplit[1];

	// 可能存在问题. todo：精简代码
	let hasInject = newSource.includes('	components: {');
	let isPortal = newSource.includes('const config = {');

	codeSplit = hasInject 
		? newSource.split('	components: {') 
		: isPortal 
			? newSource.split('const config = {')
			: newSource.split('export default {');

	newSource = hasInject 
		? codeSplit[0] + '	components: {' + content.components + codeSplit[1] 
		: isPortal 
			? codeSplit[0] + 'const config = {' + '\n	components: {' + content.components + '	},\n' + codeSplit[1]
			: codeSplit[0] + 'export default {' + '\n	components: {' + content.components + '	},\n' + codeSplit[1];

	return newSource;
};