const webpack = require("webpack");

module.exports = {
	mode: 'development',
	entry: './example/index.js',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [{
			test: /\.vue$/,
			use: [
				{
					loader: "html-loader"
				},
				{
					loader: require.resolve("./src/loader.js"),
					options: {}
				}
			]
		}]
	}
};


