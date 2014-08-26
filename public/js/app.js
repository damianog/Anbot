/// <reference path="../../typings/anbot-client.d.ts" />
var application;
(function (application) {
    var SocketIOService = (function () {
        function SocketIOService($rootScope) {
            this.rootScope = $rootScope;

            this.socket = io();
        }
        SocketIOService.prototype.on = function () {
        };

        SocketIOService.prototype.emit = function () {
        };
        return SocketIOService;
    })();
    application.SocketIOService = SocketIOService;

    (function (factories) {
        SocketIOServiceFactory.$inject = ["$rootScope", "$http"];
        function SocketIOServiceFactory($rootScope, $http) {
            return new SocketIOService($rootScope);
        }
        factories.SocketIOServiceFactory = SocketIOServiceFactory;
    })(application.factories || (application.factories = {}));
    var factories = application.factories;

    (function (directives) {
        ngTile.$inject = ["$window"];
        function ngTile($window) {
            return {
                name: "ngTile",
                restrict: "A",
                controller: "Tile",
                link: function (scope, element, attrs, ctrl) {
                    var el = element;

                    var resize = function (e) {
                        e.height(e.width());
                    };

                    $($window).on("resize", function (ev) {
                        resize(el);
                    });

                    resize(el);
                }
            };
        }
        directives.ngTile = ngTile;
    })(application.directives || (application.directives = {}));
    var directives = application.directives;

    (function (controllers) {
        var Main = (function () {
            function Main($scope) {
            }
            Main.$inject = ["$scope"];
            return Main;
        })();
        controllers.Main = Main;

        var Tile = (function () {
            function Tile($scope, $http) {
                $scope.vm = this;
                this.http = $http;
            }
            Tile.$inject = ["$scope", "$http"];
            return Tile;
        })();
        controllers.Tile = Tile;
    })(application.controllers || (application.controllers = {}));
    var controllers = application.controllers;
})(application || (application = {}));

var app = angular.module("app", []).controller(application.controllers).directive(application.directives);
//# sourceMappingURL=app.js.map
