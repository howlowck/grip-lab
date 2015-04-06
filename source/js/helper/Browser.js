var _ = require('underscore');

var Browser = {
    mediaQuerySmallEnd: '(max-width: 640px)',
    mediaQueryMediumStart: '(min-width : 641px)',
    mediaQueryLargeStart: '(min-width : 901px)',
    mediaQueryXLargeStart: '(min-width : 1201px)',
    onMediumLargeCallbacks: [],
    onSmallCallbacks: [],
    getViewportWidth: function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    },
    getViewportHeight: function () {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    },
    getInstance: function () {
        var ins = this;
        if (typeof ins.classes !== 'object') {
            ins.classes = document.querySelector('html').classList;
        }
        ins.browserViewResizeUpdate(ins.detectView());
        this.browserViewChange();
        return ins;
    },
    detectView: function () {
        var view;
        if (typeof window.matchMedia === 'function') {
            if (window.matchMedia(this.mediaQueryXLargeStart).matches) {
                view = 'xlarge';
            } else if (window.matchMedia(this.mediaQueryLargeStart).matches) {
                view = 'large';
            } else if (window.matchMedia(this.mediaQueryMediumStart).matches) {
                view = 'medium';
            } else {
                view = 'small';
            }
        } else {
            // fallback somehow
        }
        return view;
    },
    onViewChange: function () {

    },
    onMediumLargeView: function (callback) {
        this.onMediumLargeCallbacks.push(callback);
    },
    onSmallView: function(callback) {
        this.onSmallCallbacks.push(callback);
    },
    callMediumLargeCallbacks: function () {
        this.onMediumLargeCallbacks.forEach(function (callback) {
            callback();
        });
    },
    callSmallCallbacks: function () {
        this.onSmallCallbacks.forEach(function (callback) {
            callback();
        });
    },
    browserViewChange: function () {
        var ins = this;
        if (typeof window.matchMedia === 'function') {
            window.matchMedia(this.mediaQueryXLargeStart).addListener(function (mediaQueryList) {
                if (mediaQueryList.matches) {
                    ins.browserViewResizeUpdate('xlarge');
                } else {
                    ins.browserViewResizeUpdate('large');
                }
            });

            window.matchMedia(this.mediaQueryLargeStart).addListener(function (mediaQueryList) {
                if (mediaQueryList.matches) {
                    ins.browserViewResizeUpdate('large');
                } else {
                    ins.browserViewResizeUpdate('medium');
                }
            });

            window.matchMedia(this.mediaQueryMediumStart).addListener(function (mediaQueryList) {
                if (mediaQueryList.matches) {
                    ins.browserViewResizeUpdate('medium');
                    ins.callMediumLargeCallbacks();
                } else {
                    ins.browserViewResizeUpdate('small');
                    ins.callSmallCallbacks();
                }
            });
        } else {
            window.addEventListener('resize', _.debounce(function () {
                ins.browserViewResizeUpdate(ins.detectView());
            }, 100));
        }
    },
    browserViewResizeUpdate: function (viewString) {
        var ins = this,
            view = viewString;

        console.log('updated to ' + viewString);

        if (view == 'xlarge') {
            ins.classes.remove('view-small');
            ins.classes.remove('view-medium');
            ins.classes.remove('view-large');
            ins.classes.add('view-xlarge');
        } else if (view == 'small') {
            ins.classes.remove('view-xlarge');
            ins.classes.remove('view-medium');
            ins.classes.remove('view-large');
            ins.classes.add('view-small');
        } else if (view == 'medium') {
            ins.classes.remove('view-xlarge');
            ins.classes.remove('view-small');
            ins.classes.remove('view-large');
            ins.classes.add('view-medium');
        } else {
            ins.classes.remove('view-xlarge');
            ins.classes.remove('view-medium');
            ins.classes.remove('view-small');
            ins.classes.add('view-large');
        }
    },
    getIEVersion: function () {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName === 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
            if (re.exec(ua) !== null) rv = parseFloat( RegExp.$1 );
        }
        return rv;
    },
    addIEVersionToHTML: function () {
        var version = this.getIEVersion();
        if (version !== -1) {
            if (version < 9) {
                this.classes.add('browser-lt-ie9');
            } else if (version === 9) {
                this.classes.add('browser-ie9');
            } else {
                console.log('browser-ie');
                this.classes.add('browser-ie');
            }
        }
    }
};

module.exports = Browser;
