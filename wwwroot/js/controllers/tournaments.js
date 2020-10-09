function TournamentsCtrl($scope, $state, $sessionStorage, $q, $localStorage, getTournamentsService) {
    $scope.spinLoadingTournaments = false;

    $scope.selectTournament = (tournament) => {
        $state.go('app.events', { tournament: tournament });
    };

    $scope.editTournament = (tournament) => {
        $state.go('app.tournament', { tournament: tournament });
    };

    $scope.createTournament = () => {
        var tournament = {
            tournamentId: 0,
        };
        $state.go('app.tournament', { tournament: tournament });
    };

    $scope.getTournaments = () => {
        if ($sessionStorage.User === undefined) {
            $state.go("logins");
            return;
        }
        $scope.spinLoadingTournaments = true;
        getTournamentsService.getTournaments($sessionStorage.User.token).query().$promise.then(function (response) {
            $sessionStorage.tournaments = response.tournaments;
            $scope.spinLoadingTournaments = false;
        }, function (error) {
            $scope.spinLoadingTournaments = false;
            var errorMsg = "";
            if (error.status === 401) {
                errorMsg = "Unauthorised";
            }
            else {
                errorMsg = error.data;
            }
            alert("Error " + $sessionStorage.iComsErr.status + " Retrieving Tornament : " + errorMsg);
        });
    };

    $scope.getTournaments();
}
angular
    .module('inspinia')
    .controller('TournamentsCtrl', TournamentsCtrl);
