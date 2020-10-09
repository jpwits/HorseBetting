/// <reference path="../lib/blueimp-gallery/js/blueimp-gallery.min.js" />
/// <reference path="../lib/blueimp-gallery/js/blueimp-gallery.min.js" />
/*
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $urlRouterProvider.otherwise("/dashboards/dashboard_4_1");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|ftp|blob):|data:image\//);

    $stateProvider
        .state('dashboards', {
            abstract: true,
            url: "/dashboards",
            templateUrl: "views/common/content.html",
        })
        .state('dashboards.dashboard_4_1', {
            url: "/dashboard_4_1",
            templateUrl: "views/dashboard_4_1.html",
            data: { pageTitle: 'Dashboard 4' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js', 'js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angular-peity',
                            files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']
                        },
                        {
                            serie: true,
                            name: 'angular-flot',
                            files: [ 'js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js', ]
                        }
                    ]);
                }
            }
        })
        .state('layouts', {
            url: "/layouts",
            templateUrl: "views/layouts.html",
            data: { pageTitle: 'Layouts' },
        })
        .state('app', {
            abstract: true,
            url: "/app",
            templateUrl: "views/common/content.html",
        })
        .state('app.event', {
            url: "/event",
            templateUrl: "views/event.html",
            params: {event: {} },
            data: { pageTitle: 'Event' }
        })
        .state('app.events', {
            url: "/events",
            templateUrl: "views/events.html",
            params: {tournament: {}},
            data: { pageTitle: 'events' }
        })
        .state('app.eventDetail', {
            url: "/eventDetail",
            templateUrl: "views/eventDetail.html",
            params: {eventDetail: {} },
            data: { pageTitle: 'Event Detail' }
        })
        .state('app.eventDetails', {
            url: "/eventDetails",
            templateUrl: "views/eventDetails.html",
            params: { event : {} },
            data: { pageTitle: 'Event Details' }
        })
        .state('app.tournament', {
            url: "/tournament",
            templateUrl: "views/Tournament.html",
            params: { tournament: {} },
            data: { pageTitle: 'Tournament' }
        })
        .state('app.tournaments', {
            url: "/Tournaments",
            templateUrl: "views/Tournaments.html",
            data: { pageTitle: 'Tournaments' }
        })
        .state('logins', {
            url: "/logins",
            templateUrl: "views/login.html",
            data: { pageTitle: 'Login', specialClass: 'gray-bg' }
        })
        .state('register', {
            url: "/register",
            templateUrl: "views/register.html",
            data: { pageTitle: 'Register', specialClass: 'gray-bg' }
        })
        .state('forgot_password', {
            url: "/forgot_password",
            templateUrl: "views/forgot_password.html",
            data: { pageTitle: 'Forgot password', specialClass: 'gray-bg' }
        })
        //.state('ui', {
        //    abstract: true,
        //    url: "/ui",
        //    templateUrl: "views/common/content.html",
        //})
        .state('landing', {
            url: "/landing",
            templateUrl: "views/landing.html",
            data: { pageTitle: 'Landing page', specialClass: 'landing-page' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/wow/wow.min.js']
                        }
                    ]);
                }
            }
        })
        

}
angular
    .module('inspinia')
    .config(config)
    .run(function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });
