/// <reference path="../../typings/anbot-client.d.ts" />

module application {

    export interface ISocketIOService {
        on(eventName:string,callback:Function);
        emit(eventname,data,callback);
    }

    export class SocketIOService implements ISocketIOService {
        private rootScope:ng.IRootScopeService;
        private http:ng.IHttpService;
        private socket: any;

        constructor($rootScope : ng.IRootScopeService) {
            this.rootScope = $rootScope;

            this.socket = io();
        }

        on(){

        }

        emit(){

        }
    }

    export module factories {

        SocketIOServiceFactory.$inject = ["$rootScope", "$http"];
        export function SocketIOServiceFactory($rootScope, $http):ISocketIOService {
            return new SocketIOService($rootScope);
        }

    }

    export module directives {

        ngTile.$inject = ["$window"];
        export function ngTile($window:ng.IWindowService):ng.IDirective {
            return {
                name: "ngTile",
                restrict: "A",
                controller: "Tile",
                link: (scope, element, attrs, ctrl: controllers.Tile) => {

                    var el = element;

                    var resize = (e:ng.IAugmentedJQuery) => {
                        e.height(e.width());
                    };

                    $($window).on("resize", (ev) => {
                        resize(el);
                    });

                    resize(el);
                }
            };
        }
    }

    export module controllers {

        export class Main {

            static $inject = ["$scope"];

            constructor($scope:ng.IScope) {

            }
        }

        export class Tile {
            private http:ng.IHttpService;

            static $inject = ["$scope", "$http"];

            constructor($scope:ng.IScope, $http:ng.IHttpService) {
                $scope.vm = this;
                this.http = $http;
            }



        }

    }

}

var app = angular
    .module("app", [])
    .controller(application.controllers)
    .directive(application.directives);
