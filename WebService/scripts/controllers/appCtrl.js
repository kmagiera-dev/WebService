//var app = angular.module("app", []);
var app = angular.module('app', ['wj']);
window.onload = function () {
    // create a CollectionView to keep track of selection
    var cv;

    // create the grid
    var grid = new wijmo.grid.FlexGrid('#theGrid', {
        selectionMode: wijmo.grid.SelectionMode.Row,
    });

    var gridStatus = new wijmo.grid.FlexGrid('#theStatusGrid', {
        selectionMode: wijmo.grid.SelectionMode.Row,
    });

    // initialize the chart
    var chart = new wijmo.chart.FlexChart('#theChart', {
        bindingX: 'Date',
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

    var chartGestures = new wijmo.chart.interaction.ChartGestures(chart, {
        mouseAction: wijmo.chart.interaction.MouseAction.Pan,
        interactiveAxes: wijmo.chart.interaction.InteractiveAxes.XY,
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
            cv = new wijmo.collections.CollectionView(response);
            grid.itemsSource = cv;
            chart.itemsSource = cv;
            cv.currentChanged.addHandler(function (sender, args) {
                updateStatus(cv.currentItem);
            });
            updateStatus(cv.currentItem);
        }
    });

    // update the details when the CollectionView's currentItem changes
    function updateStatus(value) {
        wijmo.httpRequest('WebService.asmx/GetStatuses?', {
            data: { Id: value.Id + 1 },
            success: function (xhr) {
                var response = JSON.parse(xhr.response, dateTimeReviver);
                gridStatus.itemsSource = new wijmo.collections.CollectionView(response);
            }
        });
    }
}

function getChart() {
    if (!chart) {
        chart = wijmo.Control.getControl('#gesturesChart');
    }
    return chart;
}

function getChartGesture() {
    var gesturesChart;
    if (!chartGestures) {
        gesturesChart = getChart();
        chartGestures = c1.getExtender(gesturesChart, 'gestures');
    }
    return chartGestures;
}

function mouseActionChanged(menu) {
    var extGesture = getChartGesture();
    updateMenu(menu, 'Mouse Action');
    if (extGesture) {
        extGesture.mouseAction = wijmo.chart.interaction.MouseAction[menu.selectedItem.Header];
    }
}

function interactiveAxesChanged(menu) {
    var extGesture = getChartGesture();
    updateMenu(menu, 'Interactive Axes');
    if (extGesture) {
        extGesture.interactiveAxes = wijmo.chart.interaction.InteractiveAxes[menu.selectedItem.Header];
    }
}

function resetAxes() {
    var extGesture = getChartGesture();
    if (extGesture) {
        extGesture.reset();
    }

    document.querySelector('#reset').disabled = 'disabled';
}

// update the details when the CollectionView's currentItem changes
/*function updateStatus(value) {
    wijmo.httpRequest('WebService.asmx/GetStatuses?', {
        data: { Id: value.Id + 1 },
        success: function (xhr) {
            var response = JSON.parse(xhr.response);
            gridStatus.itemsSource = new wijmo.collections.CollectionView(response);
        }
    });
}*/

dateTimeReviver = function (key, value) {
    var a;
    if (key === 'Date') {
        a = /\/Date\((-?\d*)\)\//.exec(value);
        if (a) {
            var d = new Date(+a[1]);
            var str = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
            return str;
        }
    }
    return value;
}

