//var app = angular.module("app", []);
var app = angular.module('app', ['wj']);
window.onload = function () {

    // create the grid
    var grid = new wijmo.grid.FlexGrid('#theGrid', {
        selectionMode: wijmo.grid.SelectionMode.Row
    });

    // initialize the chart
    var chart = new wijmo.chart.FlexChart('#theChart', {
        bindingX: 'Id',
        series: [{
            binding: 'Series1',
            name: 'Series1',
            chartType: wijmo.chart.ChartType.LineSymbols
        }, {
            binding: 'Series2',
            name: 'Series2',
            chartType: wijmo.chart.ChartType.LineSymbols
        }, {
            binding: 'Series3',
            name: 'Series3',
            chartType: wijmo.chart.ChartType.LineSymbols
        }, {
            binding: 'Series4',
            name: 'Series4',
            chartType: wijmo.chart.ChartType.LineSymbols
        }, {
            binding: 'Series5',
            name: 'Series5',
            chartType: wijmo.chart.ChartType.LineSymbols
        }, {
            binding: 'Series6',
            name: 'Series6',
            chartType: wijmo.chart.ChartType.LineSymbols
        }, {
            binding: 'Series7',
            name: 'Series7',
            chartType: wijmo.chart.ChartType.LineSymbols
        }, {
            binding: 'Series8',
            name: 'Series8',
            chartType: wijmo.chart.ChartType.LineSymbols
        }, {
            binding: 'Series9',
            name: 'Series9',
            chartType: wijmo.chart.ChartType.LineSymbols,
        }, {
            binding: 'Series10',
            name: 'Series10',
            chartType: wijmo.chart.ChartType.LineSymbols
        }],
        selectionMode: wijmo.chart.SelectionMode.Point,
    });

    chart.seriesVisibilityChanged.addHandler(function () {
        // loop through chart series
        chart.series.forEach(function (series) {
            var seriesName = series.name,
                checked = series.visibility === wijmo.chart.SeriesVisibility.Visible;

            // update custom checkbox panel
            var element = document.getElementById('cb' + seriesName);
            document.getElementById('cb' + seriesName).checked = checked;
        });
    });

    // loop through custom check boxes
    ['cbSeries1', 'cbSeries2', 'cbSeries3', 'cbSeries4', 'cbSeries5', 'cbSeries6', 'cbSeries7', 'cbSeries8', 'cbSeries9', 'cbSeries10'].forEach(function (item, index) {
        // update checkbox and toggle FlexChart's series visibility when clicked
        var el = document.getElementById(item);
        el.checked = chart.series[index].visibility === wijmo.chart.SeriesVisibility.Visible;
        el.addEventListener('click', function () {
            if (this.checked) {
                chart.series[index].visibility = wijmo.chart.SeriesVisibility.Visible;
            }
            else {
                chart.series[index].visibility = wijmo.chart.SeriesVisibility.Legend;
            }
        });
    });

    // get some data
    wijmo.httpRequest('WebService.asmx/HelloWorld?$format=json', {
        success: function (xhr) {
            var response = JSON.parse(xhr.response, dateTimeReviver);
            grid.itemsSource = response;
            chart.itemsSource = response;
        }
    });
}

dateTimeReviver = function (key, value) {
    var a;
    if (key == 'Date') {
        a = /\/Date\((-?\d*)\)\//.exec(value);
        if (a) {
            var d = new Date(+a[1]);
            var str = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " +
                ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2) + ":" + ('00' + d.getMilliseconds()).slice(-3);
            return str;
        }
    }
    return value;
}

