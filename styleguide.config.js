const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')

module.exports = {
  title: 'Noor Docs',

  pagePerSection: true,

  sections: [
    {
      name: 'Introduction',
      content: 'README.md'
    },
    {
      name: 'API Reference',
      sections: [
        {
          name: 'Model components',
          description: 'Noor model components',
          components: 'src/components/NrModel*.vue'
        },
        {
          name: 'Field components',
          description: 'Noor field components',
          components: 'src/components/NrField*.vue'
        }
      ]
    }
  ],

  ribbon: {
    url: 'https://github.com/ejez/noor',
    text: 'Fork me on GitHub'
  },

  webpackConfig: {
    resolve: {
      alias: {
        noor: path.resolve(__dirname),
        src: path.resolve(__dirname, 'src/example-app/src/')
      }
    },

    module: {
      rules: [
        // Vue loader
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }
      ]
    },
    plugins: [
      // add vue-loader plugin
      new VueLoaderPlugin()
    ]
  }
}
