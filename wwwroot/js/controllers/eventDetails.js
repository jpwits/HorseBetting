
function EventDetailsCtrl($scope, $sessionStorage, $state, $stateParams, $compile, $templateCache, $timeout, getEventDetailsService) {

    if ($stateParams.event.eventId !== undefined) {
        $sessionStorage.event = $stateParams.event;
    }

    $scope.getEventDetails = () => {
        if ($sessionStorage.User === undefined) {
            $state.go("logins");
            return;
        }
        $scope.spinLoadingEventDetails = true;
        getEventDetailsService.getEventDetails($sessionStorage.User.token).query({
            eventId: $sessionStorage.event.eventId
        }).$promise.then(function (response) {
            $sessionStorage.eventDetails = response.eventDetails;
            $scope.spinLoadingEventDetails = false;
        }, function (error) {
            $scope.spinLoadingEventDetails = false;
            $sessionStorage.iComsErr = JSON.parse(JSON.stringify(error));
            alert("Error " + $sessionStorage.iComsErr.status + " Retrieving Events : " + $sessionStorage.iComsErr.data);
        });
    };

    $scope.getEventDetails();

    $scope.createEventDetail = function () {
        var eventDetail = {
            eventDetailId: 0,
            fkEventId: $sessionStorage.event.eventId
        };
        $state.go('app.eventDetail', { eventDetail: eventDetail });
    };

    $scope.editEventDetail = function (eventDetail) {
        $state.go('app.eventDetail', { eventDetail: eventDetail });
    }
}

angular
    .module('inspinia')
    .controller('EventDetailsCtrl', EventDetailsCtrl);

