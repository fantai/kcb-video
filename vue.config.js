const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const BowlPlugin = require('./bowl-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const packageInfo = require('./package.json');

module.exports = {
  productionSourceMap: false,
  publicPath: isProduction ? '/kcb-video/' : '/',
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        APP_VERSION: JSON.stringify(packageInfo.version),
      }),
    ].concat(isProduction ? [
      new ImageminPlugin(),
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp(
          `\\.(${['js', 'css'].join('|')})$`,
        ),
        threshold: 1024,
        minRatio: 0.8,
      }),
      new BowlPlugin(),
    ] : []),
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
    },
  },
  chainWebpack(config) {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule.use('vue-svg-loader').loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [
            { removeDimensions: true },
            { removeViewBox: false },
            // 保证svgo能够正确处理内联样式
            { inlineStyles: { onlyMatchedOnce: false, removeMatchedSelectors: false } },
          ],
        },
      });
    config.plugin('html').tap((args) => {
      args[0].minify = {
        ...args[0].minify,
        minifyCSS: true,
        minifyJS: true,
      };
      return args;
    });
  },
};
