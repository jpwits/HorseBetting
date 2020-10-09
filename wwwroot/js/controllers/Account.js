function AccountCtrl($window, $sessionStorage, $localStorage, $scope, $state, getEventDetailStatusService, logoutUser, registerUser, getRoles, authUser) {
    $scope.$sessionStorage = $sessionStorage.$default(/* any defaults here */);
    $scope.$localStorage = $localStorage.$default(/* any defaults here */);

    $scope.ifAdmin = function () {
        if ($sessionStorage.User === undefined)
            return false;

        if ($sessionStorage.User.roles.includes('Admin')) {
            return true;
        } else {
            return false;
        }
    }
   
    $scope.login = function (username, password) {
        $scope.entry = new authUser();
        $scope.entry.username = username;
        $scope.entry.password = password;
        $scope.entry.$save(function (response) {
            $sessionStorage.User = JSON.parse(JSON.stringify(response));
            $sessionStorage.User.name = username;
            if ($localStorage.detailStatuses === undefined) {
                $scope.getEventDetailStatus();
            }

            getRoles.get({
                username: username
            }).$promise.then(function (response) {
                $sessionStorage.User.roles = JSON.parse(JSON.stringify(response)).roles;
                $window.history.back();
            }, function (error) {
                $sessionStorage.iComsErr = JSON.parse(JSON.stringify(error));
                alert("Error " + $sessionStorage.iComsErr.status + " Getting Roles : " + $sessionStorage.iComsErr.data);
            });
        }, function (error) {
            $sessionStorage.iComsErr = JSON.parse(JSON.stringify(error));
                alert("Error " + $sessionStorage.iComsErr.status + " Logging in : " + $sessionStorage.iComsErr.data);
        });
    }

    $scope.logout = function () {
        logoutUser.get().$promise.then(function (response) {
            $sessionStorage.User = undefined;
            //$window.history.back();
            $state.go('dashboards.dashboard_4_1');
        }, function (error) {
            $sessionStorage.iComsErr = JSON.parse(JSON.stringify(error));
            alert("Error " + $sessionStorage.iComsErr.status + " Logging out : " + $sessionStorage.iComsErr.data);
        });
    };

    $scope.register = function (email, password) {
        // If we already have a bearer token, set the Authorization header - to check
        registerUser.get({
            username: email,
            email: email,
            password: password
        }).$promise.then(function (response) {
            $sessionStorage.User = JSON.parse(JSON.stringify(response));
            $scope.errors = [];
            if (response.result.succeeded === true) {
                $scope.login(email, password);
            }
            else {
                //var errorMsg = "Error Logging in : ";
                $scope.errors = response.result.errors;
                //response.result.errors.forEach(function (error) {
                //    errorMsg += error.code + ' - ' + error.description + '.......';
                //})
                //alert(errorMsg);
            }
        }, function (error) {
            $sessionStorage.iComsErr = JSON.parse(JSON.stringify(error));
                alert("Error " + $sessionStorage.iComsErr.status + " registering username : " + $sessionStorage.iComsErr.status + " : " +  $sessionStorage.iComsErr.data);
        });
    };


    $scope.getEventDetailStatus = () => {
        getEventDetailStatusService.statuses($sessionStorage.User.token).get().$promise.then(function (response) {
            $sessionStorage.detailStatuses = response.detailStatuses;
        }, function (error) {
            alert("Error retrieving lookups : " + error);
        });
    };
}
angular
    .module('inspinia')
    .controller('AccountCtrl', AccountCtrl);