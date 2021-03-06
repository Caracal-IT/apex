const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  entry: {
    theme: './src/index.ts',
    components: './src/components/index.ts'
  },
  plugins: [    
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({     
      template: './src/index.html',
      title: 'OApex Workflow Components'
    }),
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin([
      {
        context: 'node_modules/@webcomponents/webcomponentsjs',
        from: '**/*.js',
        to: 'webcomponents'
    },
    {
      context: 'node_modules/caracal_polaris/dist/polaris',
      from: '**/*.js',
      to: 'polaris'
    },
    {
      context: 'node_modules/caracal_polaris/dist/collection/web-components',
      from: '**/*.js',
      to: 'polaris_web_components'
    },
    {
      context: 'src/workflow',
      from: '**/*.wf.json',
      to: 'workflow'
    },
    {
      context: 'src/data',
      from: '**/*.json',
      to: 'data'
    },
    {
      context: 'src/assets',
      from: '**/*.css',
      to: 'css'
    }
    ]),
  ], 
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },  
  optimization: {
    splitChunks: {
        chunks: 'all',
    },
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [      
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            configFile: "tsconfig.json"
          }
        },
        {
            test: /\.css$/,
            use: [
                'to-string-loader',
                'style-loader',
                'css-loader',
            ],
        },
        {
          test: /\.theme\.scss2$/,
          use: [              
            ExtractCssChunks.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.scss$/,
          use: [
              'to-string-loader',
              'css-loader',
              'sass-loader',
          ],
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader',
            ],
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
            'file-loader',
            ],
        }
    ],
  },
};