/// <reference path="../../typings/anbot-client.d.ts" />
var anbot;
(function (anbot) {
    "use strict";

    function ApiRoute(action) {
        return "/api/" + action;
    }

    var AdminService = (function () {
        function AdminService($rootScope, $http) {
            this.rootScope = $rootScope;
            this.http = $http;
        }
        AdminService.prototype.CreateFile = function (path, content) {
            var _this = this;
            this.http.put(ApiRoute("file"), content, { params: { path: path } }).success(function (response) {
                _this.rootScope.$emit("createFile", path, response);
            });
        };

        AdminService.prototype.ReadFile = function (path, callBack) {
            var _this = this;
            this.http.get(ApiRoute("file"), { params: { path: path } }).success(function (response) {
                _this.rootScope.$emit("readFile", path, response);
                if (angular.isFunction(callBack)) {
                    callBack();
                }
            });
        };

        AdminService.prototype.UpdateFile = function (path, callBack) {
            var _this = this;
            this.rootScope.$emit("updateFile", function (content) {
                _this.http.post(ApiRoute("file"), content, { params: { path: path } }).success(function (response) {
                    if (angular.isFunction(callBack)) {
                        callBack();
                    }
                });
            });
        };

        AdminService.prototype.DeleteFile = function (path) {
            var _this = this;
            this.http.delete(ApiRoute("file")).success(function (response) {
                _this.rootScope.$emit("deleteFile", path);
            });
        };
        return AdminService;
    })();
    anbot.AdminService = AdminService;

    (function (configuration) {
        routes.$inject = ["$routeProvider", "$locationProvider"];
        function routes($routeProvider, $locationProvider) {
            $routeProvider.when("/administrator", {
                templateUrl: "/administrator/main.html",
                controller: "Main"
            }).when("/administrator/sitemanager", {
                templateUrl: "/administrator/sitemanager.html",
                controller: "SiteManager"
            }).when("/administrator/modulemanager", {
                templateUrl: "/administrator/modulemanager.html",
                controller: "ModuleManager"
            }).otherwise({ redirectTo: "/administrator" });
            $locationProvider.html5Mode(true);
        }
        configuration.routes = routes;
    })(anbot.configuration || (anbot.configuration = {}));
    var configuration = anbot.configuration;

    (function (directives) {
        function ngAce() {
            return {
                name: "ngAce",
                controller: "AceController",
                restrict: "A",
                link: function (scope, element, attrs, ctrl) {
                    var elem = element[0];
                    var editor = ace.edit(elem);

                    ctrl.Init(editor);

                    scope.$on("$destroy", function () {
                        editor.destroy();
                    });
                }
            };
        }
        directives.ngAce = ngAce;
    })(anbot.directives || (anbot.directives = {}));
    var directives = anbot.directives;

    (function (factories) {
        AdminServiceFactory.$inject = ["$rootScope", "$http"];
        function AdminServiceFactory($rootScope, $http) {
            return new AdminService($rootScope, $http);
        }
        factories.AdminServiceFactory = AdminServiceFactory;
    })(anbot.factories || (anbot.factories = {}));
    var factories = anbot.factories;

    (function (controllers) {
        var AceController = (function () {
            function AceController($rootScope) {
                var _this = this;
                this.rootScope = $rootScope;

                $rootScope.$on("readFile", function (ev, path, content) {
                    return _this.OnReadFile(path, content);
                });
                $rootScope.$on("updateFile", function (ev, cb) {
                    return _this.OnUpdateFile(cb);
                });

                this.theme = "solarized_light";
                this.mode = "text";
            }
            AceController.prototype.Init = function (editor) {
                this.editor = editor;
                editor.setTheme("ace/theme/" + this.theme);
                editor.getSession().setMode("ace/mode/" + this.AceMode(null));
            };

            AceController.prototype.OnReadFile = function (path, content) {
                this.path = path;
                this.editor.setValue(content, -1);
                var ext = path.split(".").pop();
                this.editor.getSession().setMode("ace/mode/" + this.AceMode(ext));
            };

            AceController.prototype.OnUpdateFile = function (callback) {
                callback(this.editor.getValue());
            };

            AceController.prototype.AceMode = function (extension) {
                switch (extension) {
                    case "html":
                    case "htm":
                        return "html";
                    case "css":
                        return "css";
                    case "ts":
                        return "typescript";
                    case "js":
                        return "javascript";
                    case "json":
                        return "json";
                    case "less":
                        return "less";
                    case "sass":
                        return "sass";
                    case "scss":
                        return "scss";
                    case "svg":
                        return "svg";
                    case "xml":
                        return "xml";
                    default:
                        return "text";
                }
            };
            AceController.$inject = ["$rootScope"];
            return AceController;
        })();
        controllers.AceController = AceController;

        var Root = (function () {
            function Root($rootScope, $http) {
                $http.get("/js/language_en.json").success(function (response) {
                    $rootScope.lang = response;
                });

                $rootScope.$on("Message", function () {
                });
            }
            Root.$inject = ["$rootScope", "$http"];
            return Root;
        })();
        controllers.Root = Root;

        var Main = (function () {
            function Main($scope, $http) {
                $scope.vm = this;
                this.http = $http;

                this.ServerInfo();
            }
            Main.prototype.ServerInfo = function () {
                var _this = this;
                return this.http.get(ApiRoute("serverinfo")).success(function (response) {
                    _this.serverInfo = response;
                    return _this.serverInfo;
                });
            };

            Main.prototype.Restart = function () {
                return this.http.get(ApiRoute("serverRestart"));
            };
            Main.$inject = ["$scope", "$http"];
            return Main;
        })();
        controllers.Main = Main;

        var SiteManager = (function () {
            function SiteManager($scope, $http, AdminServiceFactory) {
                $scope.vm = this;
                this.http = $http;
                this.adminService = AdminServiceFactory;

                this.aceTheme = "solarized_light";
                this.aceMode = "text";

                this.LoadFileBrowser();
            }
            SiteManager.prototype.LoadFileBrowser = function () {
                var _this = this;
                return this.http.get(ApiRoute("files")).success(function (response) {
                    _this.files = response;
                    _this.upFolder = [];
                    _this.currentFolder = _this.files;
                    return _this.files;
                });
            };

            SiteManager.prototype.CreateFile = function () {
                this.adminService.CreateFile("", "");
            };

            SiteManager.prototype.SaveFile = function () {
                if (this.currentFile) {
                    this.adminService.UpdateFile(this.currentFile.path);
                }
            };

            SiteManager.prototype.DeleteFile = function () {
                if (this.currentFile) {
                    this.adminService.DeleteFile(this.currentFile.path);
                }
            };

            SiteManager.prototype.LevelUp = function () {
                if (this.upFolder.length > 0) {
                    this.currentFolder = this.upFolder.shift();
                }
            };

            SiteManager.prototype.Explore = function (item) {
                var _this = this;
                if (item.type == "folder") {
                    this.upFolder.unshift(this.currentFolder);
                    this.currentFolder = item;
                } else if (item.type == "file") {
                    this.adminService.ReadFile(item.path, function (err) {
                        if (err) {
                            throw err;
                        }
                        _this.currentFile = item;
                    });
                }
            };

            SiteManager.prototype.Close = function () {
                if (this.currentFile) {
                    this.currentFile = null;
                    this.aceDocument = "";
                }
            };

            SiteManager.prototype.FaIcon = function (item) {
                if (item.type === "folder") {
                    return "fa-folder";
                } else {
                    var ext = item.name.split(".").pop().toUpperCase();
                    if (item.mime === "text/css") {
                        return "fa-css3";
                    } else if (item.mime === "text/html") {
                        return "fa-html5";
                    } else if (item.mime === "application/javascript") {
                        return "fa-file-code-o";
                    } else if (item.mime.split("/")[0] === "image") {
                        return "fa-file-image-o";
                    } else {
                        return "fa-file-o";
                    }
                }
            };
            SiteManager.$inject = ["$scope", "$http", "AdminServiceFactory"];
            return SiteManager;
        })();
        controllers.SiteManager = SiteManager;

        var ModuleManager = (function () {
            function ModuleManager($scope, $http) {
                $scope.vm = this;
                this.http = $http;
            }
            ModuleManager.$inject = ["$scope", "$http"];
            return ModuleManager;
        })();
        controllers.ModuleManager = ModuleManager;
    })(anbot.controllers || (anbot.controllers = {}));
    var controllers = anbot.controllers;
})(anbot || (anbot = {}));

var app = angular.module("anbot", ["ngRoute", "ngAnimate", "ui.bootstrap"]).config(anbot.configuration.routes).factory(anbot.factories).controller(anbot.controllers).directive(anbot.directives);
//# sourceMappingURL=anbot.js.map
