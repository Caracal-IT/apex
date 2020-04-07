const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'production',
});

// alias firebase="`npm config get prefix`/bin/firebase"