var _ = require('underscore');

function Topnav(selector) {
    this.construct(selector);
}

Topnav.prototype = {
    construct: function (selector) {
        this.el = document.querySelector(selector);
        this.attachEvents();
    },

    attachEvents: function () {
        document.addEventListener('scroll',
            _.throttle(this.onScroll, 150).bind(this)
        );
    },

    onScroll: function (evt) {
        var top = window.scrollY;
        if (top <= 5) {
            this.el.classList.remove('floating');
        } else {
            this.el.classList.add('floating');
        }
    },

    getEl: function () {
        return this.el;
    }
};

module.exports = Topnav;