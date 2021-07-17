module.exports =  {
	pages: {
		index: {
			// entry for the page
			entry: 'client/main.js',
			// the source template
			template: 'public/index.html',
			// output as dist/index.html
			filename: 'index.html',
			// when using title option,
			// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
			title: 'SARS-Covid-19 - Disponibilização de Vacinação',
			// chunks to include on this page, by default includes
			// extracted common chunks and vendor chunks.
			chunks: ['chunk-vendors', 'chunk-common', 'index']
		},
	},
	outputDir: 'dist/client'
}