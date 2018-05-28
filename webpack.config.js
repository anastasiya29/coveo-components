module.exports = {
	devtool: 'source-map',
	entry: './src/components.ts',
	output: {
		filename: 'dist/components.js',
		library: 'CoveoComponents',
		libraryTarget: 'var'
	},
	externals: [
		{
			"coveo-search-ui": "Coveo"
		}
	],
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{ test: /\.ts$/, loader: 'ts-loader' }
		]
	}
};
