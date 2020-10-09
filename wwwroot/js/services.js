function getTournamentsService($resource) {
    return {
        getTournaments: function (token) {
            return $resource('api/Tournaments/getTournaments', null, {
                query: {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            });
        }
    }
}

function getEventsService($resource) {
    return {
        getEvents: function (token) {
            return $resource('api/Events/GetEvents/:start/:length/:tournamentId',
                { start: '@start', length: '@length', tournamentId: '@tournamentId' }, {
                 query:  {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            });

        }
    }
}


function getEventDetailsService($resource) {
    return {
        getEventDetails: function (token) {
            return $resource('api/EventDetails/GetEventDetails/:eventId',
                { eventId: '@eventId' }, {
                query: {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            });
        }
    }
}


function getEventDetailStatusService($resource) {
    return {
        statuses: function (token) { //this need to move to init service
            return $resource('api/EventDetails/GetEventDetailStatus', null, {
                get: {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            });
        }
    }
}

function updateTournamentService($resource, token) {
    return $resource('api/Tournaments/updateTournament/:id', { id: '@id' }, {
        'update':
        {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    }
    );
}

function updateEventService($resource, token) {
    return $resource('api/Events/updateEvent', {}, {
        'update': {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    }
    );
}

function updateEventDetailService($resource, token) {
    return $resource('api/EventDetails/updateEventDetail/:id', { id: '@id' }, {
        'update': {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    }
    );
}

function authUser($resource) {
    return $resource('api/Account/authenticate'
        , {
            'update': { method: 'PUT' }
        }
    );
}

function logoutUser($resource) {
    return $resource('api/Account/logout'
    );
}

function registerUser($resource) {
    return $resource('api/Account/register/:username/:email/:password', { username: '@username', email: '@email', password: '@password' }
    );
}

function getRoles($resource) {
    return $resource('api/Account/getroles/:username', { username: '@username' }
    );
}

angular
    .module('inspinia')
   
    
    .service('getTournamentsService', ['$resource', getTournamentsService])
    .service('getEventsService', ['$resource', getEventsService])
    .service('getEventDetailsService', ['$resource', getEventDetailsService])
    .service('getEventDetailStatusService', ['$resource', getEventDetailStatusService])
    .service('updateTournamentService', ['$resource', updateTournamentService])
    .service('updateEventService', ['$resource', updateEventService])
    .service('updateEventDetailService', ['$resource', updateEventDetailService])
    .service('authUser', authUser)
    .service('logoutUser', logoutUser)
    .service('registerUser', registerUser)
    .service('getRoles', getRoles)



