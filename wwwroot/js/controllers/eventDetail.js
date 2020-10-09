function EventDetailCtrl($window, $scope, $state, $stateParams, $sessionStorage, updateEventDetailService, delEventDetailService) {
    $scope.spinUpdateEventDetail = "Save";

    $sessionStorage.eventDetail = $stateParams.eventDetail;

    $scope.updateEventDetail = function (eventDetail) {
        $scope.spinUpdateEventDetail = "Saving";
        $scope.entry = new updateEventDetailService(eventDetail);
        $scope.entry.$update(function (response) {
            $scope.spinUpdateEventDetail = "Save";
            $window.history.back();
        }, function (error) {
            $scope.spinUpdateEventDetail = "Save";
            $sessionStorage.iComsErr = JSON.parse(JSON.stringify(error));
            alert("Error " + $sessionStorage.iComsErr.status + " Updating Event Detail : " + $sessionStorage.iComsErr.data);
        });
    };

    $scope.deleteEventDetail = (eventDetail) => {
        delEventDetailService.delEventDetail($sessionStorage.User.token).get({ eventDetailId: eventDetail.eventDetailId }).$promise.then(function (response) {
            $window.history.back();
        }, function (error) {
            alert("Error retrieving lookups : " + error);
        });
    };

    $(function () {
        $('.selectpicker').selectpicker();
    });

    $scope.goBack = function () {
        $window.history.back();
    }
}


angular
    .module('inspinia')
    .controller('EventDetailCtrl', EventDetailCtrl);