const loaderUtils = require('loader-utils');

const parseDash = (str) => {
	let dashArr = str.split("-");
	let camelArr = [];

	for (let i = 0; i < dashArr.length; i++) {
		camelArr[i] = `${dashArr[i].charAt(0).toUpperCase()}${dashArr[i].substring(1)}`;
	}
	return {
		dashArr,
		camelArr
	};
};


module.exports = function (source) {
	let options = {};

	// for webpack
	if (this && this.webpack) {
		options = loaderUtils.getOptions(this);
		this.cacheable && this.cacheable();

		if (/node_modules/.test(this.resourcePath)) {
			return source;
		}
	}

	let newSource = source;

	let result = source.match(/<vcm?-([a-z-]+)([^\s>/])/g);

	let comps = [];
	source.replace(/import[\s]{([A-Z\s,a-z0-9]+)}[\s]from[\s]["']@wya\/vc["']/g, (match, target) => {
		target.replace(/[\s]+/g, '').split(',').forEach(i => {
			!comps.includes(i) && comps.push(i);
		});
		return match;
	})
	if (!result) {
		return source;
	}
	let target = result.reduce((pre, cur, index, old) => {
		if (old.indexOf(cur) === index) {
			let dash = cur.replace(/(<vc-?|\s)/g, '');
			let camel = parseDash(dash).camelArr.join('');
			let template = `${/^m-/.test(dash) ? 'vc' : 'vc-'}${dash}`;

			let hasImport = comps.includes(camel);
			let hasComp = (new RegExp(`['"]${template}['"]:[\\s]${camel}`)).test(source);
			pre.push({
				dash,
				template,
				camel,
				hasImport,
				hasComp,
			});
		}

		return pre;
	}, []);

	let content = target.reduce((pre, cur) => {
		let { imports, components } = pre;
		let importContent;
		/**
		 * 常用组件与特殊组件
		 */
		if (
			/(-item|-pane|-group|-menu|-column|-view)$/.test(cur.dash)
			|| /(transition-|input-)/.test(cur.dash)
		) {
			let { dashArr, camelArr } = parseDash(cur.dash);

			importContent = cur.hasImport ? '' : `import ${camelArr.slice(0, -1).join('')} from '@wya/vc/lib/${dashArr.slice(0, -1).join('-')}';\n`;

			components = pre.components + (cur.hasComp ? '' : `		'${cur.template}': ${camelArr.slice(0, -1).join('')}.${camelArr[camelArr.length - 1]},\n`);
		} else {
			importContent = cur.hasImport ? '' : `import ${cur.camel} from '@wya/vc/lib/${cur.dash}';\n`;
			components = pre.components + (cur.hasComp ? '' : `		'${cur.template}': ${cur.camel},\n`);
		}
		
		if (importContent) {
			importContent = importContent.replace(/lib\/m-([^']+)/, 'lib/$1/index.m');
		}
		if (!pre.imports.includes(importContent)) {
			imports = pre.imports + importContent;
		}

		return {
			imports,
			components
		};
	}, {
		imports: '\n',
		components: '\n'
	});
	
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