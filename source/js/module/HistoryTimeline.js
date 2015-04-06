var _ = require('underscore');

function HistoryTimeline(container, story) {
    this.construct(container, story);
}

HistoryTimeline.prototype = {
    construct: function (container, story) {
        this.el = document.querySelector(container);
        this.stories = [].slice.call(this.el.children);
        this.attachEvents();
    },

    attachEvents: function () {
        document.addEventListener('scroll',
            _.throttle(this.onScroll, 150).bind(this)
        );
    },

    onScroll: function (evt) {
        var top = window.scrollY;
        if (top >= this.getTimelineOffset() && this.stories.length > 0) {
            this.revealStories();
        }
    },

    getEl: function () {
        return this.el;
    },

    getTimelineOffset: function () {
        return this.el.offsetTop - 400;
    },

    revealStories: function () {
        var story;
        this.interval = setInterval(function () {
            if (this.stories.length <= 0) {
                return;
            }
            story = this.stories.shift();
            story.classList.add('show');
            if (this.stories.length === 0) {
                clearInterval(this.interval);
            }
        }.bind(this), 100);
    }

};

module.exports = HistoryTimeline;