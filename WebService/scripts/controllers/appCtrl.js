var app = angular.module("app", []);

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