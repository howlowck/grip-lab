var Topnav = require('./module/Topnav');
var HistoryTimeline = require('./module/HistoryTimeline');
var DonutChart = require('./module/DonutChart');
var _ = require('underscore');
var Browser = require('./helper/Browser');
var Container = require('./helper/Container');

var topnav = new Topnav('.top-nav');
var history = new HistoryTimeline('.detailed-history');
var app = new Container();

b = Browser.getInstance();

app.instance('browser', b);

allDonuts = DonutChart.findAndCreateAll(null, {
    width: 250,
    colors: ['#eb2127', '#58595b'],
    animate: true,
    animationDuration: 900,
    startingValues:[ 10, 20 ]
}, app);

