'use strict';

// Declare app level module which depends on views, and components 
var app = angular.module('ticker', []);

app.value("apiURL", "http://finance.yahoo.com/webservice/v1/symbols/YHOO,MSFT,AAPL,GOOG/quote?format=json");

app.controller("StockController", ['$scope', '$interval', '$http', 'apiURL', function ($scope, $interval, $http, apiURL) {

    $scope.quotes = [
        {Name: "Microsoft", Symbol: "MSFT", Value: 43.93, Trend: "up"},
        {Name: "Yahoo", Symbol: "YHOO", Value: 33.14, Trend: "up"},
        {Name: "Google", Symbol: "GOOG", Value: 630.38, Trend: "up"},
        {Name: "Apple", Symbol: "AAPL", Value: 113.29, Trend: "up"}
    ];

    var find = function (c, fn) {
        var r;
        for (var i in c) {
            if (fn(c[i])) {
                r = c[i];
                break;
            }
        }
        return r;
    };

    var updateQuotes = function () {

        $http.jsonp(apiURL + "&callback=JSON_CALLBACK").
            success(function (json) {
                console.log("Success");
                var quotes = json.list.resources;

                angular.forEach(quotes, function (quote) {

                    var masterquote = find($scope.quotes, function (s) {
                        return s.Symbol == quote.resource.fields.symbol
                    });
                    if (masterquote) {
                        var prevVal = masterquote.Value;
                        //(Math.random() * 100).toFixed(2);
                        masterquote.Value = parseFloat(quote.resource.fields.price).toFixed(2);
                        masterquote.Trend = prevVal > masterquote.Value ? "down" : "up";
                    }
                });
            }).
            error(function (data, status) {
                console.log("Error");
            });
    };

    $interval(updateQuotes, 5000);
    updateQuotes();
}]);