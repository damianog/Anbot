/// <reference path="../../typings/anbot-client.d.ts" />
module anbot {
    "use strict";

    export interface IAdminService {
        CreateFile(path:string, content:string);
        ReadFile(path:string, cb?:(error?:any) => void);
        UpdateFile(path:string, cb?:(error?:any) =>void);
        DeleteFile(path:string);
    }

    function ApiRoute(action:string) {
        return "/api/" + action;
    }

    export class AdminService implements IAdminService {
        private rootScope:ng.IRootScopeService;
        private http:ng.IHttpService;

        constructor($rootScope, $http:ng.IHttpService) {
            this.rootScope = $rootScope;
            this.http = $http;
        }

        public CreateFile(path:string, content:string) {
            this.http
                .put<any>(ApiRoute("file"), content, { params: {path: path }})
                .success((response)=> {
                    this.rootScope.$emit("createFile", path, response);
                });
        }

        public ReadFile(path:string, callBack?:(error?:any) => void) {
            this.http
                .get<string>(ApiRoute("file"), { params: {path: path }})
                .success((response)=> {
                    this.rootScope.$emit("readFile", path, response);
                    if (angular.isFunction(callBack)) {
                        callBack();
                    }
                });
        }

        public UpdateFile(path:string, callBack?:(error?:any) => void) {
            this.rootScope.$emit("updateFile", (content:string)=> {
                this.http
                    .post<any>(ApiRoute("file"), content, { params: {path: path }})
                    .success((response)=> {
                        if (angular.isFunction(callBack)) {
                            callBack();
                        }
                    });
            });
        }

        public DeleteFile(path:string) {
            this.http
                .delete<any>(ApiRoute("file"))
                .success((response)=> {
                    this.rootScope.$emit("deleteFile", path);
                });
        }

    }

    export module configuration {

        routes.$inject = ["$routeProvider", "$locationProvider"];
        export function routes($routeProvider:ng.route.IRouteProvider, $locationProvider:ng.ILocationProvider) {
            $routeProvider
                .when("/administrator", {
                    templateUrl: "/administrator/main.html",
                    controller: "Main"
                })
                .when("/administrator/sitemanager", {
                    templateUrl: "/administrator/sitemanager.html",
                    controller: "SiteManager"
                })
                .when("/administrator/modulemanager", {
                    templateUrl: "/administrator/modulemanager.html",
                    controller: "ModuleManager"
                })
                .otherwise({redirectTo: "/administrator"});
            $locationProvider.html5Mode(true);
        }
    }

    export module directives {

        export function ngAce():ng.IDirective {
            return {
                name: "ngAce",
                controller: "AceController",
                restrict: "A",
                link: (scope:ng.IScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes, ctrl:controllers.AceController) => {
                    var elem = element[0];
                    var editor = ace.edit(elem);

                    ctrl.Init(editor);

                    scope.$on("$destroy", ()=> {
                        editor.destroy();
                    });
                }
            };
        }
    }

    export module factories {

        AdminServiceFactory.$inject = ["$rootScope", "$http"];
        export function AdminServiceFactory($rootScope, $http):IAdminService {
            return new AdminService($rootScope, $http);
        }

    }

    export module controllers {

        export class AceController {
            private rootScope:ng.IScope;

            private editor:AceAjax.Editor;
            private theme:string;
            private mode:string;

            private path:string;

            static $inject = ["$rootScope"];

            constructor($rootScope:ng.IScope) {
                this.rootScope = $rootScope;

                $rootScope.$on("readFile", (ev, path, content) => this.OnReadFile(path, content));
                $rootScope.$on("updateFile", (ev, cb) => this.OnUpdateFile(cb));

                this.theme = "solarized_light";
                this.mode = "text";
            }

            public Init(editor:AceAjax.Editor) {
                this.editor = editor;
                editor.setTheme("ace/theme/" + this.theme);
                editor.getSession().setMode("ace/mode/" + this.AceMode(null));
            }

            private OnReadFile(path:string, content:any) {
                this.path = path;
                this.editor.setValue(content, -1);
                var ext = path.split(".").pop();
                this.editor.getSession().setMode("ace/mode/" + this.AceMode(ext));
            }

            private OnUpdateFile(callback:(content:string) =>void) {
                callback(this.editor.getValue());
            }

            private AceMode(extension:string):string {
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
                    default :
                        return "text";
                }
            }
        }

        export class Root {
            public lang:any;

            static $inject = ["$rootScope", "$http"];

            constructor($rootScope:ng.IRootScopeService, $http:ng.IHttpService) {
                $http
                    .get<any>("/js/language_en.json")
                    .success((response)=> {
                        (<any>$rootScope).lang = response;
                    });

                $rootScope.$on("Message", ()=> {
                });
            }
        }

        export class Main {
            private http:ng.IHttpService;

            public serverInfo:any;

            static $inject = ["$scope", "$http"];

            constructor($scope:ng.IScope, $http:ng.IHttpService) {
                $scope.vm = this;
                this.http = $http;

                this.ServerInfo();
            }

            public ServerInfo() {
                return this.http
                    .get<any>(ApiRoute("serverinfo"))
                    .success((response)=> {
                        this.serverInfo = response;
                        return this.serverInfo;
                    });
            }

            public Restart() {
                return this.http
                    .get<any>(ApiRoute("serverRestart"));
            }
        }

        export class SiteManager {
            private http:ng.IHttpService;
            private adminService:IAdminService;

            public files:anbot.IFileInfo;
            public upFolder:anbot.IFileInfo[];
            public currentFolder:anbot.IFileInfo;
            public currentFile:anbot.IFileInfo;
            public aceEditor:AceAjax.Editor;
            public aceDocument:any;
            public aceMode:any;
            public aceTheme:any;

            static $inject = ["$scope", "$http", "AdminServiceFactory"];

            constructor($scope:ng.IScope, $http:ng.IHttpService, AdminServiceFactory:IAdminService) {
                $scope.vm = this;
                this.http = $http;
                this.adminService = AdminServiceFactory;

                this.aceTheme = "solarized_light";
                this.aceMode = "text";

                this.LoadFileBrowser();
            }

            public LoadFileBrowser() {
                return this.http
                    .get<any>(ApiRoute("files"))
                    .success((response)=> {
                        this.files = response;
                        this.upFolder = [];
                        this.currentFolder = this.files;
                        return this.files;
                    });
            }

            public CreateFile() {
                this.adminService.CreateFile("", "");
            }

            public SaveFile() {
                if (this.currentFile) {
                    this.adminService.UpdateFile(this.currentFile.path);
                }
            }

            public DeleteFile() {
                if (this.currentFile) {
                    this.adminService.DeleteFile(this.currentFile.path);
                }
            }

            public LevelUp() {
                if (this.upFolder.length > 0) {
                    this.currentFolder = this.upFolder.shift();
                }
            }

            public Explore(item:anbot.IFileInfo) {
                if (item.type == "folder") {
                    this.upFolder.unshift(this.currentFolder);
                    this.currentFolder = item;
                } else if (item.type == "file") {
                    this.adminService.ReadFile(item.path, (err)=> {
                        if (err) {
                            throw err;
                        }
                        this.currentFile = item;
                    });
                }
            }

            public Close() {
                if (this.currentFile) {
                    this.currentFile = null;
                    this.aceDocument = "";
                }
            }

            public FaIcon(item:anbot.IFileInfo):string {
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
                    }
                    else {
                        return "fa-file-o";
                    }
                }
            }
        }

        export class ModuleManager {
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
    .module("anbot", ["ngRoute", "ngAnimate", "ui.bootstrap"])
    .config(anbot.configuration.routes)
    .factory(anbot.factories)
    .controller(anbot.controllers)
    .directive(anbot.directives);