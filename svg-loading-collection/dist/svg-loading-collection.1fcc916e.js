// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"3d4fu":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 63672;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "47f455d51fcc916e";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"fILKw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _indexJs = require("./loaders/index.js");
var _mainModuleCss = require("./styles/main.module.css");
var _mainModuleCssDefault = parcelHelpers.interopDefault(_mainModuleCss);
let currentLoader = null;
const animationStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulseRing {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
  }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.5); opacity: 0.5; }
  }
  
  @keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes dash {
    0% { stroke-dashoffset: 100; }
    50% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -100; }
  }
  
  @keyframes infinityDash {
    0% { stroke-dashoffset: 200; }
    100% { stroke-dashoffset: -200; }
  }
  
  @keyframes heartbeatDash {
    0%, 100% { stroke-dashoffset: 300; }
    50% { stroke-dashoffset: 0; }
  }
  
  @keyframes spiralDash {
    0% { stroke-dashoffset: 150; }
    100% { stroke-dashoffset: -150; }
  }
  
  @keyframes morph {
    0%, 100% { d: path("M50,10 L90,90 L10,90 Z"); }
    33% { d: path("M50,10 L90,50 L50,90 L10,50 Z"); }
    66% { d: path("M50,10 C90,10 90,90 50,90 C10,90 10,10 50,10 Z"); }
  }
  
  @keyframes dropMorph {
    0%, 100% { 
      d: path("M50,10 C70,30 80,50 80,65 C80,85 65,95 50,95 C35,95 20,85 20,65 C20,50 30,30 50,10 Z");
    }
    50% { 
      d: path("M50,20 C65,35 75,55 75,70 C75,85 65,90 50,90 C35,90 25,85 25,70 C25,55 35,35 50,20 Z");
    }
  }
  
  @keyframes starPulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(0.9) rotate(15deg); }
    50% { transform: scale(1.1) rotate(0deg); }
    75% { transform: scale(0.9) rotate(-15deg); }
  }
  
  @keyframes growRing {
    0% { r: 5; opacity: 1; }
    100% { r: 45; opacity: 0; }
  }
  
  .spinner-circle { animation: spin 1s linear infinite; }
  .dashed-ring { animation: spin 1.5s linear infinite; }
  .dual-ring { animation: spin 2s linear infinite; }
  .three-ring { animation: spin 1.2s linear infinite; }
  .pulse-ring { animation: pulseRing 1.5s ease-in-out infinite; }
  .dots-bounce .dot { animation: bounce 1.4s ease-in-out infinite both; }
  .dots-bounce .dot:nth-child(1) { animation-delay: -0.32s; }
  .dots-bounce .dot:nth-child(2) { animation-delay: -0.16s; }
  .dots-bounce .dot:nth-child(3) { animation-delay: 0s; }
  .dots-pulse .dot { animation: pulse 1s ease-in-out infinite; }
  .dots-pulse .dot:nth-child(1) { animation-delay: 0s; }
  .dots-pulse .dot:nth-child(2) { animation-delay: 0.1s; }
  .dots-pulse .dot:nth-child(3) { animation-delay: 0.2s; }
  .dots-pulse .dot:nth-child(4) { animation-delay: 0.3s; }
  .dots-pulse .dot:nth-child(5) { animation-delay: 0.4s; }
  .dots-rotate { animation: spin 2s linear infinite; }
  .dots-wave .dot { animation: wave 1.2s ease-in-out infinite; }
  .dots-wave .dot:nth-child(1) { animation-delay: 0s; }
  .dots-wave .dot:nth-child(2) { animation-delay: 0.1s; }
  .dots-wave .dot:nth-child(3) { animation-delay: 0.2s; }
  .dots-wave .dot:nth-child(4) { animation-delay: 0.3s; }
  .dots-wave .dot:nth-child(5) { animation-delay: 0.4s; }
  .path-dash .path { stroke-dasharray: 100; animation: dash 2s ease-in-out infinite; }
  .infinity-path .path { stroke-dasharray: 200; animation: infinityDash 2s linear infinite; }
  .heartbeat .path { stroke-dasharray: 300; animation: heartbeatDash 1.5s ease-in-out infinite; }
  .spiral-path .path { stroke-dasharray: 150; animation: spiralDash 3s linear infinite; }
  .morph-shape path { animation: morph 3s ease-in-out infinite; }
  .water-drop path { animation: dropMorph 2s ease-in-out infinite; }
  .star-pulse path { transform-origin: center; animation: starPulse 2s ease-in-out infinite; }
  .orbit-dots { animation: spin 3s linear infinite; }
  .orbit-dots .orbit { animation: spin 1.5s linear infinite reverse; }
  .growing-ring circle { transform-origin: center; animation: growRing 1.5s ease-in-out infinite; }
  .growing-ring circle:nth-child(1) { animation-delay: 0s; }
  .growing-ring circle:nth-child(2) { animation-delay: 0.5s; }
  .growing-ring circle:nth-child(3) { animation-delay: 1s; }
`;
function init() {
    const styleEl = document.createElement('style');
    styleEl.textContent = animationStyles;
    document.head.appendChild(styleEl);
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="${(0, _mainModuleCssDefault.default).container}">
      <header class="${(0, _mainModuleCssDefault.default).header}">
        <h1>SVG \u{52A0}\u{8F7D}\u{52A8}\u{753B}\u{5408}\u{96C6}</h1>
        <p>\u{70B9}\u{51FB}\u{5DE6}\u{4FA7}\u{5217}\u{8868}\u{5207}\u{6362}\u{52A8}\u{753B}\u{FF0C}\u{70B9}\u{51FB}\u{590D}\u{5236}\u{6309}\u{94AE}\u{83B7}\u{53D6}\u{4EE3}\u{7801}</p>
      </header>
      <div class="${(0, _mainModuleCssDefault.default).mainContent}">
        <div class="${(0, _mainModuleCssDefault.default).loaderList}">
          <h2>\u{52A8}\u{753B}\u{5217}\u{8868}</h2>
          <div id="loader-list"></div>
        </div>
        <div class="${(0, _mainModuleCssDefault.default).loaderPreview}">
          <div class="${(0, _mainModuleCssDefault.default).previewHeader}">
            <h2 id="loader-name">\u{9009}\u{62E9}\u{4E00}\u{4E2A}\u{52A8}\u{753B}</h2>
            <button id="copy-btn" class="${(0, _mainModuleCssDefault.default).copyButton}" disabled>
              <span>\u{1F4CB}</span> \u{590D}\u{5236}\u{4EE3}\u{7801}
            </button>
          </div>
          <div class="${(0, _mainModuleCssDefault.default).previewArea}" id="preview-area">
            <div style="color: #999; font-size: 1.2rem;">\u{8BF7}\u{4ECE}\u{5DE6}\u{4FA7}\u{9009}\u{62E9}\u{4E00}\u{4E2A}\u{52A0}\u{8F7D}\u{52A8}\u{753B}</div>
          </div>
          <div class="${(0, _mainModuleCssDefault.default).codeSection}" id="code-section" style="display: none;">
            <h3>SVG \u{4EE3}\u{7801}</h3>
            <div class="${(0, _mainModuleCssDefault.default).codeBlock}">
              <pre id="code-content"></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    renderLoaderList();
    setupCopyButton();
}
function renderLoaderList() {
    const listContainer = document.getElementById('loader-list');
    (0, _indexJs.categories).forEach((category)=>{
        const categoryTitle = document.createElement('div');
        categoryTitle.className = (0, _mainModuleCssDefault.default).categoryTitle;
        categoryTitle.textContent = category.name;
        listContainer.appendChild(categoryTitle);
        (0, _indexJs.loaders)[category.id].forEach((loader)=>{
            const item = document.createElement('div');
            item.className = (0, _mainModuleCssDefault.default).loaderItem;
            item.dataset.loaderId = loader.id;
            item.dataset.category = category.id;
            const preview = document.createElement('div');
            preview.className = (0, _mainModuleCssDefault.default).loaderItemPreview;
            preview.innerHTML = `<div style="transform: scale(0.5); transform-origin: center;">${loader.svg}</div>`;
            const name = document.createElement('span');
            name.className = (0, _mainModuleCssDefault.default).loaderItemName;
            name.textContent = loader.name;
            item.appendChild(preview);
            item.appendChild(name);
            item.addEventListener('click', ()=>selectLoader(loader, category.id));
            listContainer.appendChild(item);
        });
    });
}
function selectLoader(loader, category) {
    document.querySelectorAll(`.${(0, _mainModuleCssDefault.default).loaderItem}`).forEach((item)=>{
        item.classList.remove((0, _mainModuleCssDefault.default).active);
    });
    const activeItem = document.querySelector(`[data-loader-id="${loader.id}"]`);
    if (activeItem) activeItem.classList.add((0, _mainModuleCssDefault.default).active);
    currentLoader = loader;
    document.getElementById('loader-name').textContent = loader.name;
    const previewArea = document.getElementById('preview-area');
    previewArea.innerHTML = `<div class="${loader.cssClass}">${loader.svg}</div>`;
    const codeSection = document.getElementById('code-section');
    codeSection.style.display = 'block';
    const codeContent = document.getElementById('code-content');
    codeContent.textContent = formatCode(loader);
    document.getElementById('copy-btn').disabled = false;
}
function formatCode(loader) {
    return loader.svg.replace(/></g, '>\n<').replace(/^\s+|\s+$/g, '').split('\n').map((line)=>line.trim()).filter((line)=>line).join('\n');
}
function setupCopyButton() {
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.addEventListener('click', async ()=>{
        if (!currentLoader) return;
        try {
            const codeToCopy = formatCode(currentLoader);
            await navigator.clipboard.writeText(codeToCopy);
            copyBtn.classList.add((0, _mainModuleCssDefault.default).copySuccess);
            copyBtn.innerHTML = "<span>\u2713</span> \u5DF2\u590D\u5236!";
            setTimeout(()=>{
                copyBtn.classList.remove((0, _mainModuleCssDefault.default).copySuccess);
                copyBtn.innerHTML = "<span>\uD83D\uDCCB</span> \u590D\u5236\u4EE3\u7801";
            }, 2000);
        } catch (err) {
            console.error("\u590D\u5236\u5931\u8D25:", err);
            copyBtn.innerHTML = "<span>\u2717</span> \u590D\u5236\u5931\u8D25";
            setTimeout(()=>{
                copyBtn.innerHTML = "<span>\uD83D\uDCCB</span> \u590D\u5236\u4EE3\u7801";
            }, 2000);
        }
    });
}
document.addEventListener('DOMContentLoaded', init);

},{"./loaders/index.js":"29dxU","./styles/main.module.css":"cFLdf","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"29dxU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "loaders", ()=>loaders);
parcelHelpers.export(exports, "categories", ()=>categories);
const loaders = {
    circular: [
        {
            id: 'spinner-circle',
            name: "\u5706\u5F62\u65CB\u8F6C",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="spinner-circle" cx="50" cy="50" r="40" stroke="#667eea" stroke-width="6" fill="none" stroke-linecap="round"/>
      </svg>`,
            cssClass: 'spinner-circle'
        },
        {
            id: 'dashed-ring',
            name: "\u865A\u7EBF\u73AF\u5F62",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="dashed-ring" cx="50" cy="50" r="40" stroke="#764ba2" stroke-width="6" fill="none" stroke-dasharray="10 5" stroke-linecap="round"/>
      </svg>`,
            cssClass: 'dashed-ring'
        },
        {
            id: 'dual-ring',
            name: "\u53CC\u73AF\u65CB\u8F6C",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="dual-ring" cx="50" cy="50" r="35" stroke="#667eea" stroke-width="5" fill="none"/>
        <circle class="dual-ring" cx="50" cy="50" r="45" stroke="#764ba2" stroke-width="5" fill="none" stroke-dasharray="15 10"/>
      </svg>`,
            cssClass: 'dual-ring'
        },
        {
            id: 'three-ring',
            name: "\u4E09\u73AF\u4EA4\u9519",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="three-ring" cx="50" cy="50" r="30" stroke="#667eea" stroke-width="4" fill="none"/>
        <circle class="three-ring" cx="50" cy="50" r="38" stroke="#764ba2" stroke-width="4" fill="none" style="animation-direction: reverse; animation-duration: 1.5s"/>
        <circle class="three-ring" cx="50" cy="50" r="46" stroke="#9f7aea" stroke-width="4" fill="none" style="animation-duration: 2s"/>
      </svg>`,
            cssClass: 'three-ring'
        },
        {
            id: 'pulse-ring',
            name: "\u8109\u51B2\u73AF",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle class="pulse-ring" cx="50" cy="50" r="40" stroke="#667eea" stroke-width="5" fill="none"/>
      </svg>`,
            cssClass: 'pulse-ring'
        },
        {
            id: 'growing-ring',
            name: "\u6269\u6563\u73AF",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="growing-ring">
        <circle cx="50" cy="50" r="5" stroke="#667eea" stroke-width="3" fill="none"/>
        <circle cx="50" cy="50" r="5" stroke="#764ba2" stroke-width="3" fill="none"/>
        <circle cx="50" cy="50" r="5" stroke="#9f7aea" stroke-width="3" fill="none"/>
      </svg>`,
            cssClass: 'growing-ring'
        }
    ],
    dots: [
        {
            id: 'dots-bounce',
            name: "\u5F39\u8DF3\u70B9",
            svg: `<svg width="100" height="50" viewBox="0 0 100 50" class="dots-bounce">
        <circle class="dot" cx="25" cy="25" r="10" fill="#667eea"/>
        <circle class="dot" cx="50" cy="25" r="10" fill="#764ba2"/>
        <circle class="dot" cx="75" cy="25" r="10" fill="#9f7aea"/>
      </svg>`,
            cssClass: 'dots-bounce'
        },
        {
            id: 'dots-pulse',
            name: "\u8109\u51B2\u70B9",
            svg: `<svg width="100" height="50" viewBox="0 0 100 50" class="dots-pulse">
        <circle class="dot" cx="15" cy="25" r="8" fill="#667eea"/>
        <circle class="dot" cx="35" cy="25" r="8" fill="#764ba2"/>
        <circle class="dot" cx="55" cy="25" r="8" fill="#667eea"/>
        <circle class="dot" cx="75" cy="25" r="8" fill="#764ba2"/>
        <circle class="dot" cx="95" cy="25" r="8" fill="#9f7aea"/>
      </svg>`,
            cssClass: 'dots-pulse'
        },
        {
            id: 'dots-rotate',
            name: "\u65CB\u8F6C\u70B9",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="dots-rotate">
        <circle cx="50" cy="15" r="8" fill="#667eea"/>
        <circle cx="75" cy="30" r="8" fill="#764ba2"/>
        <circle cx="85" cy="55" r="8" fill="#9f7aea"/>
        <circle cx="75" cy="80" r="8" fill="#667eea"/>
        <circle cx="50" cy="90" r="8" fill="#764ba2"/>
        <circle cx="25" cy="80" r="8" fill="#9f7aea"/>
        <circle cx="15" cy="55" r="8" fill="#667eea"/>
        <circle cx="25" cy="30" r="8" fill="#764ba2"/>
      </svg>`,
            cssClass: 'dots-rotate'
        },
        {
            id: 'dots-wave',
            name: "\u6CE2\u6D6A\u70B9",
            svg: `<svg width="100" height="60" viewBox="0 0 100 60" class="dots-wave">
        <circle class="dot" cx="15" cy="30" r="8" fill="#667eea"/>
        <circle class="dot" cx="35" cy="30" r="8" fill="#764ba2"/>
        <circle class="dot" cx="55" cy="30" r="8" fill="#9f7aea"/>
        <circle class="dot" cx="75" cy="30" r="8" fill="#667eea"/>
        <circle class="dot" cx="95" cy="30" r="8" fill="#764ba2"/>
      </svg>`,
            cssClass: 'dots-wave'
        },
        {
            id: 'orbit-dots',
            name: "\u8F68\u9053\u70B9",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="orbit-dots">
        <circle cx="50" cy="50" r="35" stroke="#e0e0e0" stroke-width="2" fill="none"/>
        <g class="orbit">
          <circle cx="85" cy="50" r="8" fill="#667eea"/>
          <circle cx="15" cy="50" r="8" fill="#764ba2"/>
        </g>
        <circle cx="50" cy="50" r="10" fill="#9f7aea"/>
      </svg>`,
            cssClass: 'orbit-dots'
        }
    ],
    path: [
        {
            id: 'path-dash',
            name: "\u63CF\u8FB9\u52A8\u753B",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="path-dash">
        <path class="path" d="M50,10 L90,50 L50,90 L10,50 Z" stroke="#667eea" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
            cssClass: 'path-dash'
        },
        {
            id: 'infinity-path',
            name: "\u65E0\u9650\u7B26\u53F7",
            svg: `<svg width="100" height="50" viewBox="0 0 100 50" class="infinity-path">
        <path class="path" d="M25,25 C25,10 45,10 50,25 C55,40 75,40 75,25 C75,10 55,10 50,25 C45,40 25,40 25,25" stroke="#667eea" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>`,
            cssClass: 'infinity-path'
        },
        {
            id: 'heartbeat',
            name: "\u5FC3\u8DF3\u7EBF",
            svg: `<svg width="120" height="50" viewBox="0 0 120 50" class="heartbeat">
        <path class="path" d="M10,25 L30,25 L40,10 L50,40 L60,25 L80,25 L90,10 L100,40 L110,25" stroke="#e74c3c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
            cssClass: 'heartbeat'
        },
        {
            id: 'spiral-path',
            name: "\u87BA\u65CB\u8DEF\u5F84",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="spiral-path">
        <path class="path" d="M50,50 m0,-40 a40,40 0 1,1 0,80 a40,40 0 1,1 0,-80" stroke="#667eea" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>`,
            cssClass: 'spiral-path'
        }
    ],
    morph: [
        {
            id: 'morph-shape',
            name: "\u5F62\u72B6\u53D8\u6362",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="morph-shape">
        <path d="M50,10 L90,90 L10,90 Z" fill="#667eea"/>
      </svg>`,
            cssClass: 'morph-shape'
        },
        {
            id: 'water-drop',
            name: "\u6C34\u6EF4\u53D8\u5F62",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="water-drop">
        <path d="M50,10 C70,30 80,50 80,65 C80,85 65,95 50,95 C35,95 20,85 20,65 C20,50 30,30 50,10 Z" fill="#3498db"/>
      </svg>`,
            cssClass: 'water-drop'
        },
        {
            id: 'star-pulse',
            name: "\u661F\u5F62\u8109\u51B2",
            svg: `<svg width="100" height="100" viewBox="0 0 100 100" class="star-pulse">
        <path d="M50,10 L58,38 L88,38 L64,56 L72,86 L50,68 L28,86 L36,56 L12,38 L42,38 Z" fill="#f1c40f"/>
      </svg>`,
            cssClass: 'star-pulse'
        }
    ]
};
const categories = [
    {
        id: 'circular',
        name: "\u73AF\u5F62\u52A0\u8F7D"
    },
    {
        id: 'dots',
        name: "\u70B9\u9635\u52A0\u8F7D"
    },
    {
        id: 'path',
        name: "\u8F68\u8FF9\u52A0\u8F7D"
    },
    {
        id: 'morph',
        name: "\u5F62\u53D8\u52A0\u8F7D"
    }
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"cFLdf":[function(require,module,exports,__globalThis) {
module.exports["active"] = `K0b1SW_active`;
module.exports["categoryTitle"] = `K0b1SW_categoryTitle`;
module.exports["codeBlock"] = `K0b1SW_codeBlock`;
module.exports["codeSection"] = `K0b1SW_codeSection`;
module.exports["container"] = `K0b1SW_container`;
module.exports["copyButton"] = `K0b1SW_copyButton`;
module.exports["copySuccess"] = `K0b1SW_copySuccess`;
module.exports["header"] = `K0b1SW_header`;
module.exports["loaderItem"] = `K0b1SW_loaderItem`;
module.exports["loaderItemName"] = `K0b1SW_loaderItemName`;
module.exports["loaderItemPreview"] = `K0b1SW_loaderItemPreview`;
module.exports["loaderList"] = `K0b1SW_loaderList`;
module.exports["loaderPreview"] = `K0b1SW_loaderPreview`;
module.exports["mainContent"] = `K0b1SW_mainContent`;
module.exports["previewArea"] = `K0b1SW_previewArea`;
module.exports["previewHeader"] = `K0b1SW_previewHeader`;

},{}]},["3d4fu","fILKw"], "fILKw", "parcelRequire791f", {})

//# sourceMappingURL=svg-loading-collection.1fcc916e.js.map
