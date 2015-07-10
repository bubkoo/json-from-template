
var autoIncrementInteger = 0;

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

function readfile(file) {

    // check for existence first
    if (!fs.existsSync(file)) {
        throw new Error(file + ' doesn\'t exist');
    }

    var ext = path.extname(file);

    // YAML file
    if (ext.match(/ya?ml/)) {
        var res = fs.readFileSync(file, 'utf8');
        return yaml.safeLoad(res);
    }

    // JS / JSON / CoffeeScript
    if (ext.match(/json|js|coffee|ls/)) {
        if (require.cache[file]) {
            delete require.cache[file];
        }
        return require(file);
    }

    // unknown
    throw new Error(file + ' is an unsupported filetype');
}

module.exports = {

    'formItem': function (keys) {
        var data = this.params || {};
        var result;

        if (typeof keys === 'string') {
            result = data[keys];
        } else if (Object.prototype.toString.call(keys) === 'object Array') {
            result = [];
            keys.forEach(function (key) {
                result.push(data[key]);
            });
        } else {
            result = keys;
        }

        return result;
    },

    'fromFile': function (filePath) {
        try {
            if (filePath) {
                return readfile(path.resolve(filePath));
            } else {
                return 'no file path specified.';
            }
        } catch (error) {
            return error + '';
        }
    },

    'increment': function (start, step) {
        return autoIncrementInteger += +step || 1;
    },

    'inc': this.increment
};