app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('registro', {
        url: '/registro',
        templateUrl: 'templates/registro.html',
        controller: 'RegistroCtrl'
    });

    $stateProvider.state('tabs', {
        abstract: true,
        url: '/tabs',
        templateUrl: 'templates/tabs.html',
        controller: 'TabsCtrl'
    });


    $stateProvider.state('tabs.usuarios', {
        url: '/usuarios',
        views: {
            "tab-usuarios": {
                templateUrl: 'templates/tab-usuarios.html',
                controller: 'UsuariosCtrl'
            }
        }       
    });

    $stateProvider.state('tabs.mensagens', {
        url: '/mensagens',
        views: {
            "tab-mensagens": {
                templateUrl: 'templates/tab-mensagens.html',
                controller: 'MensagensCtrl'
            }
        }       
    });

     $stateProvider.state('tabs.mensagem', {
        url: '/mensagem',
        views: {
            "tab-mensagens": {
                templateUrl: 'templates/mensagem.html',
                controller: 'MensagemCtrl'
            }
        }       
    });

    $stateProvider.state('tabs.profile', {
        cache: false,
        url: '/profile',
        views: {
            "tab-profile": {
                templateUrl: 'templates/tab-profile.html',
                controller: 'ProfileCtrl'
            }
        }       
    });

    $urlRouterProvider.otherwise('/login');

});