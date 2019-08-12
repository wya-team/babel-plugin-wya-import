const loaderUtils = require('loader-utils');

const parseKebab = (str) => {
	let lower = str.split("-");
	let upper = [];

	for (let i = 0; i < lower.length; i++) {
		upper[i] = `${lower[i].charAt(0).toUpperCase()}${lower[i].substring(1)}`;
	}
	return {
		lower,
		upper
	};
};

module.exports = function(source) {
	let options = {};

	// for webpack
	if (this && this.webpack) {
		options = loaderUtils.getOptions(this);
		this.cacheable && this.cacheable();

		if (/node_modules/.test(this.resourcePath)) {
			return source;
		}
	}

	let result = source.match(/<vcm?-([a-z-]+)([^\s>/])/g);
	if (!result) return source;
	let newSource = source;

	// 已存在的组件
	let comps = {};
	source.replace(/import[\s]{?([A-Z\s,a-z0-9]+)}?[\s]from[\s]["']@wya\/vc[^;]/g, (match, target) => {
		target.replace(/[\s]+/g, '').split(',').forEach(i => {
			!comps[i] && (comps[i] = true);
		});
		return match;
	})

	let content = result.reduce((pre, cur, index, old) => {
		if (old.indexOf(cur) === index) {
			let kebab = cur.replace(/(<vc-?|\s)/g, '');
			let { lower, upper } = parseKebab(kebab);
			let camel = upper.join('');
			let compKey = `${/^m-/.test(kebab) ? 'vc' : 'vc-'}${kebab}`;
			let compValue = camel;
			let isChild = /(-item|-pane|-group|-menu|-column|-view)$/.test(kebab) || /(transition-|input-|tree-)/.test(kebab);

			if (isChild) {
				camel = upper.slice(0, -1).join('');
				kebab = lower.slice(0, -1).join('-');
				compValue = `${camel}.${upper[upper.length - 1]}`;
			}

			let hasComp = (new RegExp(`['"]${compKey}['"]:[\\s]${compValue}`)).test(source);
			let hasImport = !!comps[camel];

			let { imports, components } = pre;
			let importContent;
			let compContent;
			/**
			 * 常用组件与特殊组件
			 */
			importContent = hasImport ? '' : `import ${camel} from '@wya/vc/lib/${kebab}';\n`;
			compContent = hasComp ? '' : `		'${compKey}': ${compValue},\n`;

			if (importContent) {
				importContent = importContent.replace(/lib\/m-([^']+)/, 'lib/$1/index.m');
			}

			if (!pre.imports.includes(importContent)) {
				imports = pre.imports + importContent;
			}

			if (!pre.components.includes(compContent)) {
				components = pre.components + compContent;
			}

			return {
				imports,
				components
			};
		}
		return pre;
	}, {
		imports: '\n',
		components: '\n'
	});

	let codeSplit;
	codeSplit = newSource.split('<script>');
	newSource = codeSplit[0] + '<script>' + content.imports + codeSplit[1];

	let hasInject = newSource.includes('	components: {');

	if (hasInject) {
		let tag = '	components: {';
		codeSplit = newSource.split(tag);
		newSource = codeSplit[0] + tag + content.components + codeSplit[1];
	} else {
		let isPortal = false;
		let portalKey = ['wrapperComponent', 'config']; // TODO: 外部配置
		let portalTag;

		for (let i = 0; i < portalKey.length; i++) {
			portalTag = `const ${portalKey[i]} = {`;
			isPortal = newSource.includes(portalTag);

			if (isPortal) break;
		}

		let tag = isPortal 
			? portalTag 
			: 'export default {';

		codeSplit = newSource.split(tag);
		newSource = codeSplit[0] + tag + '\n	components: {' + content.components + '	},\n' + codeSplit[1];
	}
	return newSource;
};