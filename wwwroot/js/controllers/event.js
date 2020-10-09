function EventCtrl($window, $scope, $state, $stateParams, $sessionStorage, updateEventService, delEventService) {
    $sessionStorage.event = $stateParams.event;
    if ($sessionStorage.event.eventDateTime !== undefined) {
         $sessionStorage.event.eventDateTime = new Date($sessionStorage.event.eventDateTime);
    }
  
    if ($sessionStorage.event.eventDateTime !== undefined) {
        if ($sessionStorage.event.eventEndDateTime !== null) {
            $sessionStorage.event.eventEndDateTime = new Date($sessionStorage.event.eventEndDateTime);
        }
    }
    $scope.spinUpdateEvent = "Save";

    $scope.updateEvent = function (event) {
        $scope.spinUpdateEvent = "Saving";

        $scope.entry = new updateEventService(event, $sessionStorage.User.token);
        $scope.entry.$update(function (response) {
            $scope.spinUpdateEvent = "Save";
            $window.history.back();

        }, function (error) {
            $scope.spinUpdateEvent = "Save";
            $sessionStorage.iComsErr = JSON.parse(JSON.stringify(error));
            alert("Error " + $sessionStorage.iComsErr.status + " Updating Event : " + $sessionStorage.iComsErr.data);
        });
    };

    $scope.deleteEvent = function (event) {
        if (confirm('Are you sure you want to delete this event?!!!')) {
            delEventService.delEvent($sessionStorage.User.token).get({ eventId: event.eventId }).$promise.then(function (response) {
                $window.history.back();
            }, function (error) {
                alert("Error deleteing event : " + error);
            });
        }
    };

    $scope.goBack = function () {
        $window.history.back();
    }

    //Date Time popups
    $scope.dtStart = new Date(1987, 1, 1);
    $scope.dtEnd = new Date(2030, 1, 1);

    $scope.dateOptions = {
        datepickerMode: 'day',
        minMode: 'day',
        showWeeks: 'true',
        dateDisabled: false,
        formatYear: 'yyyy',
        maxDate: $scope.dtEnd,
        minDate: $scope.dtStart,
        startingDay: 1
    };

    $scope.openStart = function () {
        $scope.popupStart.opened = true;
    };

    $scope.openEnd = function () {
        $scope.popupEnd.opened = true;
    };

    $scope.formats = ['yyyy-M!-d!'];
    $scope.format = $scope.formats[0];
    //$scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.altInputFormats = ['yyyy/M!/d!'];

    $scope.popupStart = {
        opened: false
    };

    $scope.popupEnd = {
        opened: false
    };
   

    $(function () {
        $('.selectpicker').selectpicker();
    });
}

angular
    .module('inspinia')
    .controller('EventCtrl', EventCtrl);