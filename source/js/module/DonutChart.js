var d3 = require('d3');
var _ = require('underscore');

var DonutChart = function (elOrSelector, options, app) {

    this.browser  = app.retrieve('browser');
    if (elOrSelector instanceof Object) {
        this.construct(elOrSelector, options);
    } else {
        this.construct(document.querySelector(elOrSelector), options);
    }
};

function deepClone(array) {
    var output = [];
    array.forEach(function (obj) {
        output.push(_.clone(obj));
    });
    return output;
}

DonutChart.findAndCreateAll = function (selector, options, app) {
    var collection = [];
    if (selector == undefined || selector === null) {
        selector = '.donut-chart';
    }
    [].slice.call(document.querySelectorAll(selector)).forEach(function (el) {
         collection.push(new DonutChart(el, options, app));
    });

    return collection;
};

DonutChart.defaultOptions = {
    width: 300,
    height: 300,
    innerRingPct: 80,
    padding: 20,
    colors: ['#58595b','#eb2127'],
    centerText: [{text: '', size: '0'}],
    animate: false,
    animationDuration: 500,
    startingValues: [1, 1, 1],
    easeType: "bounce",
    animationStartPoint: null,
    animationStartPointOffset: 200,
    data: [
        {label: 'apples', value: 5},
        {label: 'oranges', value: 10},
        {label: 'grapes', value: 23}
    ],
    scrollCallback: function (evt) {
        if (window.scrollY >= (this.animationStartPoint - this.browser.getViewportHeight() + this.options.animationStartPointOffset)) {
            this.animationFunc();
        }
    }
};

DonutChart.prototype = {
    construct: function (el, options) {
        this.parent = d3.select(el);
        this.options = _.defaults(options, DonutChart.defaultOptions);

        if (this.options.animationStartPoint === null) {
            this.setAnimationStartPoint(el.offsetTop);
        } else {
            this.setAnimationStartPoint(this.options.animationStartPoint);
        }
        this.container = this.createContainer(this.parent);
        this.data = this.getData(el);
        this.centerText = this.getCenterText(el);
        this.createChart(this.container);
        this.animationFunc = _.once(this.startAnimation);
        document.addEventListener('scroll',
            _.throttle(this.options.scrollCallback, 150).bind(this)
        );
    },
    getData: function (el) {
        var datasetDiv = el.querySelector('.dataset');
        if (datasetDiv === null) {
            return this.options.data;
        }

        var data = [];
        [].slice.call(datasetDiv.querySelectorAll('li')).forEach(function (li) {
            var label = li.querySelector('.label').innerText;
            var value = +li.querySelector('.value').innerText;
            data.push({label: label, value: value});
        });
        return data;
    },
    getCenterText: function (el) {
        var textDivs = el.querySelectorAll('.data-text');
        if (textDivs.length === 0) {
            return this.options.centerText;
        }
        var texts = [];

        [].slice.call(textDivs).forEach(function (textDiv) {
            var text = textDiv.innerText;
            var size = textDiv.dataset.size;
            texts.push({text:text, size: size});
        });

        return texts;
    },
    setValue: function (value) {
        this.value = value;
    },
    createContainer: function (outer) {
        return outer.append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height);
    },
    createChart: function (svg) {
        var radius = this.findR(this.options.width, this.options.padding, this.options.innerRingPct);
        var width = this.options.width;
        var height = this.options.height;

        var data = deepClone(this.data);

        if (this.options.animate) {
            _.forEach(data, function (data, i) {
                data.value = this.options.startingValues[i];
            }.bind(this));
        }

        var color = d3.scale.ordinal()
            .domain(_.pluck(data, 'label'))
            .range(this.options.colors);
        var chart = svg.append('g')
            .classed('chart', true)
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');

        this.arc = d3.svg.arc()
            .outerRadius(radius.outer)
            .innerRadius(radius.inner);

        this.pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        this.path = chart.selectAll('path')
            .data(this.pie(data))
            .enter()
            .append('path')
            .attr('d', this.arc)
            .each(function(d) {this._current = d})
            .attr('fill', function (d, i) {
                return color(d.data.label);
            });


        chart.append("text")
            //.attr("transform", function(d) {
            //    //return "translate(" + arc.centroid(d) + ")";
            //})
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .attr("font-size", this.centerText[0].size)
            .text(this.centerText[0].text);

        return chart;
    },
    startAnimation: function () {
        var arc = this.arc;
        console.log('start donut animation');
        function arcTween (a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            }
        }
        this.path = this.path.data(this.pie(this.data));
        this.path.transition().ease(this.options.easeType).duration(+this.options.animationDuration).attrTween('d', arcTween);
    },
    setInitialData: function (data) {
        data.forEach(function (d) {
            d.value = 1;
        });
        return data;
    },
    getValue: function () {
        return this.value;
    },
    findCenter: function (width) {
        var x;
        var y;
        x = width / 2;
        y = width / 2;
        return {x: x, y: y};
    },
    findR: function (width, padding, innerPct) {
        var outer, inner;
        outer = (width / 2) - padding;
        inner = outer * (innerPct/100);
        return {outer: outer, inner: inner};
    },
    setAnimationStartPoint: function (value) {
        this.animationStartPoint = value;
    }
};

module.exports = DonutChart;
