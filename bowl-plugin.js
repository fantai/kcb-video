// 在html-webpack-plugin处理过程中将加载的css和js资源替换成bowl缓存加载方式
const fs = require('fs');
const packageInfo = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
const bowlSource = fs.readFileSync('./node_modules/bowl.js/lib/bowl.min.js');
const bowlInjectScript = `
(function() {
  var version = '${packageInfo.version}';

  function minorVersion(v) {
    return v.split('.').slice(0, 2).join('.');
  }

  function refreshCache() {
    // 刷新当前页面缓存
    return fetch(window.location.href, { headers: { 'cache-control': 'max-age=0' } });
  }

  function toUrl(url) {
    // 先加载一次页面，使之缓存后再跳转页面
    return fetch(url).then(function() {
      window.location.replace(url);
    });
  }

  // 加载bowl配置，如果请求远程超时则直接取本地数据，超时时间1秒
  function fetchBowlConfig() {
    return new Promise(function(resolve) {
      window.fetch('./bowl.json')
        .then(function(res) { return res.json(); })
        .then(resolve);
      setTimeout(function() {
        resolve(BOWL_CONFIG_JSON);
      }, 1000);
    });
  }

  // 加载bowl.json
  fetchBowlConfig().then(function(bowlJSON) {
    var lastVersion = bowlJSON.version;

    // 比较 Major.Minor 版本号，如果不同则修改版本参数后重新加载页面
    if (minorVersion(version) !== minorVersion(lastVersion)) {
      var href = window.location.href;
      var versionParam = 'version=' + lastVersion;
      var url = href.match(/version=[^&]+/)
        ? href.replace(/version=[^&]+/, versionParam)
        : (href + (href.indexOf('?') > 0 ? '&' : '?') + versionParam);
      refreshCache();
      return toUrl(url);
    }

    // 启动bowl
    var b = new Bowl(); 
    b.add(bowlJSON.resources);
    b.inject();
  });
})();
`;

module.exports = class BowlPlugin {
  apply(compiler) {
    let bowlConfig;
    let bowlConfigJSON;
    compiler.hooks.compilation.tap('bowl-plugin', (compilation) => {
      // 没有使用html插件不存在对应的hook
      if (!compilation.hooks.htmlWebpackPluginAlterAssetTags) {
        return;
      }
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tap('bowl-plugin', (htmlPluginData) => {
        if (isProduction) {

          // 过滤掉header中包含 rel="stylesheet" 的link（css）和body中 type="text/javascript" 的script（js）
          const cacheResources = [];
          htmlPluginData.head = htmlPluginData.head.filter((eachTag) => {
            if (eachTag.tagName === 'link' && eachTag.attributes && eachTag.attributes.rel === 'stylesheet' && eachTag.attributes.href) {
              eachTag.css = true;
              cacheResources.push(eachTag);
              return false;
            }
            return true;
          });
          htmlPluginData.body = htmlPluginData.body.filter((eachTag) => {
            if (eachTag.tagName === 'script' && eachTag.attributes && eachTag.attributes.type === 'text/javascript' && eachTag.attributes.src) {
              eachTag.js = true;
              cacheResources.push(eachTag);
              return false;
            }
            return true;
          });

          // 将使用bowl处理的缓存资源从head的预加载中移除，由于在钉钉webview出现预加载中的资源在使用异步请求时返回数据不完整导致js解析失败
          const cacheUrls = cacheResources.map(resource => resource.attributes.href || resource.attributes.src);
          htmlPluginData.head = htmlPluginData.head.filter(
            eachTag => !(eachTag.tagName === 'link' && eachTag.attributes
              && eachTag.attributes.rel === 'preload' && cacheUrls.indexOf(eachTag.attributes.href) >= 0)
          );

          const dependencies = [];
          bowlConfig = cacheResources.map((resource, index) => {
            const key = `kcb_${index}`;
            const result = {
              key: key,
              dependencies: [...dependencies],
            };
            if (resource.css) {
              result.url = resource.attributes.href;
            } else {
              result.url = resource.attributes.src;
              dependencies.push(key);
            }
            return result;
          });

          bowlConfigJSON = JSON.stringify({
            version: packageInfo.version,
            resources: bowlConfig,
          });
          const injectScript = bowlInjectScript.replace('BOWL_CONFIG_JSON', bowlConfigJSON);
          [bowlSource, injectScript].forEach(eachScript => htmlPluginData.body.push({
            tagName: 'script',
            closeTag: true,
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: eachScript,
          }));
        }
        return htmlPluginData;
      });
    });
    compiler.hooks.emit.tap('bowl-plugin', (compilation) => {
      compilation.assets['bowl.json'] = {
        source: function() { return new Buffer(bowlConfigJSON) },
        size: function() { return Buffer.byteLength(bowlConfigJSON, 'utf8'); }
      };
    });
  }
};
