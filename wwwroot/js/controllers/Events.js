function EventsCtrl($scope, $state, $stateParams, $sessionStorage, $localStorage, getEventsService, $timeout, $q) {
    $scope.spinLoadingEvents = false;

    if ($stateParams.tournament.tournamentId !== undefined) {
        $sessionStorage.tournament = $stateParams.tournament;
    }

    if ($localStorage.session_pglen === undefined) {
        $localStorage.session_pglen = "50";
    }

    $scope.pageSize = $localStorage.session_pglen;
    $scope.viewby = $localStorage.session_pglen;
    $scope.maxSize = 5; //Number of pager buttons to show

    if ($sessionStorage.currentPage === undefined) {
        $sessionStorage.currentPage = 1;
    }

    if ($sessionStorage.numberOfPages === undefined) {
        $sessionStorage.numberOfPages = 1;
    }

    $scope.getEvents = () => {
        if ($sessionStorage.User === undefined) {
            $state.go("logins");
            return;
        }
        $scope.spinLoadingEvents = true;
        getEventsService.getEvents($sessionStorage.User.token).query({
            start: ($sessionStorage.currentPage - 1) * $localStorage.session_pglen,
            length: $sessionStorage.currentPage * $localStorage.session_pglen,
            tournamentId: $sessionStorage.tournament.tournamentId
        }).$promise.then(function (response) {
            $sessionStorage.events = response.events;
            $sessionStorage.numberOfPages = Math.ceil(response.recordsTotal / $localStorage.session_pglen);
            $scope.spinLoadingEvents = false;
        }, function (error) {
            $scope.spinLoadingEvents = false;
            $sessionStorage.iComsErr = JSON.parse(JSON.stringify(error));
            alert("Error " + $sessionStorage.iComsErr.status + " Retrieving Events : " + $sessionStorage.iComsErr.data);
        });
    };

    $scope.getEvents();

    $scope.editEvent = function (event) {
        $state.go('app.event', {event: event});
    }

    $scope.setItemsPerPage = function (num) {
        $localStorage.session_pglen = num;
        $sessionStorage.events = undefined;
        $scope.getEvents();
    };

    $scope.selectEvent = (event) => {
        if ($sessionStorage.User === undefined) {
            $state.go("logins");
            return;
        }
        $state.go('app.eventDetails', { event: event });
    };

    $scope.createEvent = function () {
        var event = {
            eventId: 0,
            fkTournamentId: $sessionStorage.tournament.tournamentId,
            fkTournament: null,
            eventDetail:null
        };
        $state.go('app.event', { event: event });
    };
}

angular
    .module('inspinia')
    .filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            return input.slice(start);
        };
    })
    //.controller('PaginationDemoCtrl', PaginationDemoCtrl)
    .controller('EventsCtrl', EventsCtrl);


