var _ = require('underscore');

function Container () {
    this.abstract = {};
    this.concrete = {};
    this.singletons = {};
}

Container.prototype = {
    register: function (name, callback, context) {
        if (typeof context === 'undefined') {
            context = this;
        }
        this.abstract[name] = callback.bind(context);
    },
    singleton: function (name, callback, context) {
        if (typeof context === 'undefined') {
            context = this;
        }
        this.singletons[name] = callback.bind(context);
    },
    instance: function (name, instance) {
        this.concrete[name] = instance;
    },
    getInstance: function (name) {
        return this.concrete[name];
    },
    makeInstance: function (name) {
        if (typeof this.abstract[name] === 'function') {
            return this.abstract[name]();
        }
        return null;
    },
    getSingleton: function (name) {
        if (typeof this.singletons[name] === 'function') {
            var obj = this.singletons[name]();
            this.singletons[name] = obj;
            return obj;
        } else if (typeof this.singletons[name] === 'object') {
            return this.singletons[name];
        }
        return null;
    },
    retrieve: function (name) {
        if (typeof this.singletons[name] !== 'undefined') {
            return this.getSingleton(name);
        }
        if (typeof this.abstract[name] !== 'undefined') {
            return this.makeInstance(name);
        }
        if (typeof this.concrete[name] !== 'undefined') {
            return this.getInstance(name);
        }
        return null;
    }
};

module.exports = Container;
