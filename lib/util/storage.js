'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('assert');
var _ = require('lodash');

/**
 * Storage instances handle a json file where Generator authors can store data.
 *
 * The `Generator` class instantiate the storage named `config` by default.
 *
 * @constructor
 * @param {String} name       The name of the new storage (this is a namespace)
 * @param {mem-fs-editor} fs  A mem-fs editor instance
 * @param {String} configPath The filepath used as a storage.
 *
 * @example
 * class extend Generator {
 *   writing: function() {
 *     this.config.set('coffeescript', false);
 *   }
 * }
 */

var Storage = function () {
  function Storage(name, fs, configPath) {
    _classCallCheck(this, Storage);

    assert(name, 'A name parameter is required to create a storage');
    assert(configPath, 'A config filepath is required to create a storage');

    this.path = configPath;
    this.name = name;
    this.fs = fs;
    this.existed = Object.keys(this._store).length > 0;
  }

  /**
   * Return the current store as JSON object
   * @return {Object} the store content
   * @private
   */


  _createClass(Storage, [{
    key: '_persist',


    /**
     * Persist a configuration to disk
     * @param {Object} val - current configuration values
     * @private
     */
    value: function _persist(val) {
      var fullStore = this.fs.readJSON(this.path, {});
      fullStore[this.name] = val;
      this.fs.write(this.path, JSON.stringify(fullStore, null, '  '));
    }

    /**
     * Save a new object of values
     * @return {null}
     */

  }, {
    key: 'save',
    value: function save() {
      this._persist(this._store);
    }

    /**
     * Get a stored value
     * @param  {String} key  The key under which the value is stored.
     * @return {*}           The stored value. Any JSON valid type could be returned
     */

  }, {
    key: 'get',
    value: function get(key) {
      return this._store[key];
    }

    /**
     * Get all the stored values
     * @return {Object}  key-value object
     */

  }, {
    key: 'getAll',
    value: function getAll() {
      return _.cloneDeep(this._store);
    }

    /**
     * Assign a key to a value and schedule a save.
     * @param {String} key  The key under which the value is stored
     * @param {*} val  Any valid JSON type value (String, Number, Array, Object).
     * @return {*} val  Whatever was passed in as val.
     */

  }, {
    key: 'set',
    value: function set(key, val) {
      assert(!_.isFunction(val), 'Storage value can\'t be a function');

      var store = this._store;

      if (_.isObject(key)) {
        val = _.extend(store, key);
      } else {
        store[key] = val;
      }

      this._persist(store);
      return val;
    }

    /**
     * Delete a key from the store and schedule a save.
     * @param  {String} key  The key under which the value is stored.
     * @return {null}
     */

  }, {
    key: 'delete',
    value: function _delete(key) {
      var store = this._store;
      delete store[key];
      this._persist(store);
    }

    /**
     * Setup the store with defaults value and schedule a save.
     * If keys already exist, the initial value is kept.
     * @param  {Object} defaults  Key-value object to store.
     * @return {*} val  Returns the merged options.
     */

  }, {
    key: 'defaults',
    value: function defaults(_defaults) {
      assert(_.isObject(_defaults), 'Storage `defaults` method only accept objects');
      var val = _.defaults(this.getAll(), _defaults);
      this.set(val);
      return val;
    }
  }, {
    key: '_store',
    get: function get() {
      return this.fs.readJSON(this.path, {})[this.name] || {};
    }
  }]);

  return Storage;
}();

module.exports = Storage;