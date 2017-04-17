'use strict';

var _ = require('lodash');
var chalk = require('chalk');

var deprecate = function deprecate(message, fn) {
  return function () {
    deprecate.log(message);
    return fn.apply(this, arguments);
  };
};

deprecate.log = function (message) {
  console.log(chalk.yellow('(!) ') + message);
};

deprecate.object = function (message, object) {
  var msgTpl = _.template(message);
  var mirror = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(object)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var name = _step.value;

      var func = object[name];

      if (typeof func !== 'function') {
        mirror[name] = func;
        continue;
      }

      mirror[name] = deprecate(msgTpl({ name: name }), func);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return mirror;
};

deprecate.property = function (message, object, property) {
  var original = object[property];
  Object.defineProperty(object, property, {
    get: function get() {
      deprecate.log(message);
      return original;
    }
  });
};

module.exports = deprecate;