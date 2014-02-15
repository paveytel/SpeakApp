var mout = require('mout');
var rc = require('./util/rc');
var defaults = require('./util/defaults');
var expand = require('./util/expand');

function Config(cwd) {
    this._cwd = cwd || process.cwd();
    this._config = {};
}

Config.prototype.load = function () {
    this._config = rc('bower', defaults, this._cwd);
    return this;
};

Config.prototype.get = function (key) {
    // TODO
};

Config.prototype.set = function (key, value) {
    // TODO
    return this;
};

Config.prototype.del = function (key, value) {
    // TODO
    return this;
};

Config.prototype.save = function (where, callback) {
    // TODO
};

Config.prototype.toObject = function () {
    var config = mout.lang.deepClone(this._config);

    config = Config.normalise(config);
    return config;
};

Config.create = function (cwd) {
    return new Config(cwd);
};

Config.read = function (cwd) {
    var config = new Config(cwd);
    return config.load().toObject();
};

Config.normalise = function (rawConfig) {
    var config = {};

    // Mix in defaults and raw config
    mout.object.deepMixIn(config, expand(defaults), expand(rawConfig));

    // Some backwards compatible things..
    config.shorthandResolver = config.shorthandResolver
    .replace(/\{\{\{/g, '{{')
    .replace(/\}\}\}/g, '}}');

    // Ensure that every registry endpoint does not end with /
    config.registry.search = config.registry.search.map(function (url) {
        return url.replace(/\/+$/, '');
    });
    config.registry.register = config.registry.register.replace(/\/+$/, '');
    config.registry.publish = config.registry.publish.replace(/\/+$/, '');

    return config;
};

module.exports = Config;