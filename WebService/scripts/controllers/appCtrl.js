var app = angular.module("app", []);
window.onload = function () {

    // create the grid
    var grid = new wijmo.grid.FlexGrid('#theGrid');

    // get some data
    wijmo.httpRequest('WebService.asmx/HelloWorld?$format=json', {
        success: function (xhr) {
            var response = JSON.parse(xhr.response, dateTimeReviver);
            grid.itemsSource = response;
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


app.controller("appCtrl", function($scope, $http) {
    function getData() {
        var result = new wijmo.collections.ObservableArray();
        $http({
            url: 'WebService.asmx/HelloWorld',
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8 ' },
        }).success(function (data, status, headers, config) {
            $scope.posts = data;
            result = data;
        }).error(function (data, status, headers, config) {
            $scope.status = status + ' ' + headers;
        });
        return result;
    }

    $scope.data = new wijmo.collections.CollectionView(getData());

    /*$http({
        url: 'WebService.asmx/HelloWorld',
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8 ' },
    }).success(function (data, status, headers, config) {
        $scope.posts = data;
        $scope.data = new wijmo.collections.CollectionView(data);
    }).error(function (data, status, headers, config) {
        $scope.status = status + ' ' + headers;
    });*/

});