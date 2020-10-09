function TournamentCtrl($window, $scope, $state, $stateParams, $sessionStorage, $localStorage, $q, updateTournamentService, delTournamentService) {
    $scope.spinUpdateTournament = "Save";

    $sessionStorage.tournament = $stateParams.tournament

    $scope.updateTournament = function (tournament) {
        $scope.spinUpdateTournament = "Saving";
        $scope.entry = new updateTournamentService(tournament);
        $scope.entry.$update(function (response) {
            $scope.spinUpdateTournament = "Save";
            $state.go("app.tournaments");
        }, function (error) {
            $scope.spinUpdateTournament = "Save";
            var errorMsg = "";
            if (error.status === 401) {
                errorMsg = "Unauthorised";
            }
            else {
                errorMsg = error.data;
            }
            alert("Error " + $sessionStorage.iComsErr.status + " Updating Tournament : " + errorMsg);
        });
    };

    $scope.deleteTournament = (tournament) => {
        if (confirm('Are you sure you want to delete this tournament, by deleting this tournament you will loose all the tournament events?')) {
            delTournamentService.delTournament($sessionStorage.User.token).get({ tournamentId: tournament.tournamentId }).$promise.then(function (response) {
                $window.history.back();
            }, function (error) {
                alert("Error deleteing event : " + error);
            });
        }
    };
   
    $scope.goBack = function () {
        $window.history.back();
    }
}
angular
    .module('inspinia')
    .controller('TournamentCtrl', TournamentCtrl);
