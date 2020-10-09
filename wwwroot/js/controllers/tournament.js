﻿function TournamentCtrl($window, $scope, $state, $stateParams, $sessionStorage, $localStorage, $q, updateTournamentService) {
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
            $scope.entry = new updateTournamentService(tournament);
            $scope.entry.$update(function (response) {
                $window.history.back();
            }, function (error) {
                var errorMsg = "";
                if (error.status === 401) {
                    errorMsg = "Unauthorised";
                }
                else {
                    errorMsg = error.data;
                }
                alert("Error " + $sessionStorage.iComsErr.status + " Deleting Tournament : " + errorMsg);
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
