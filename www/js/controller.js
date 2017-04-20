app.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $ionicPopup, $ionicLoading) {

    $scope.usuario = {};

    $scope.authObj = $firebaseAuth();

    var firebaseUser = $scope.authObj.$getAuth();

    if (firebaseUser) {
        $state.go('tabs.usuarios');
    }

    $scope.login = function(usuario) {

        $ionicLoading.show({template: 'Loading...'});

        $scope.authObj.$signInWithEmailAndPassword(usuario.email, usuario.password)
            .then(function(firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $ionicLoading.hide();
                $state.go('tabs.usuarios');
            }).catch(function(error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Falha no Login',
                    template: error.message
                });
            });
    }
});

app.controller('RegistroCtrl', function($scope, $state, $firebaseAuth, $firebaseObject, $ionicPopup, $ionicLoading) {

    $scope.usuario = {};

    $scope.authObj = $firebaseAuth();

    $scope.registrar = function(usuario) {

         $ionicLoading.show({template: 'Saving...'});

        $scope.authObj.$createUserWithEmailAndPassword(usuario.email, usuario.password)
            .then(function(firebaseUser) {

                $ionicLoading.hide();

                console.log("User " + firebaseUser.uid + " created successfully!");

                addUsuario(firebaseUser);
                $state.go('login');

            }).catch(function(error) {

                $ionicLoading.hide();

                var alertPopup = $ionicPopup.alert({
                    title: 'Falha no Registro',
                    template: error.message
                });
            });
    }

    function addUsuario(firebaseUser) {

        var ref = firebase.database().ref('usuarios/' + firebaseUser.uid);

        var obj = $firebaseObject(ref);

        obj.displayName = firebaseUser.email;
        obj.email = firebaseUser.email;
        obj.$save().then(function(ref) {
            ref.key === obj.$id; // true
            console.log('Usuário criado na base de dados');
        }, function(error) {
            console.log("Error:", error);
        });
    }

});

app.controller('TabsCtrl', function($scope) {

});

app.controller('UsuariosCtrl', function($scope, $firebaseArray) {

    var ref = firebase.database().ref('usuarios');
    $scope.usuarios = $firebaseArray(ref);

});

app.controller('MensagensCtrl', function($scope) {

});

app.controller('MensagemCtrl', function($scope) {

});

app.controller('ProfileCtrl', function($scope, $state, $firebaseAuth, $firebaseObject, $ionicLoading) {

    $scope.authObj = $firebaseAuth();

    var firebaseUser = $scope.authObj.$getAuth();

    $scope.usuario = angular.copy(firebaseUser);

    $scope.logout = function() {
        $scope.authObj.$signOut();
        $state.go('login');
    }

    $scope.atualizar = function(usuario) {

        $ionicLoading.show({template: 'Saving...'});
        
        firebaseUser.updateProfile({            
            displayName: usuario.displayName
            //TODO: Atualizar Imagem...
        }).then(function(response) {
            $ionicLoading.hide();
            console.log("ok" + response);
            atualizarUsuario(usuario.displayName);
        }, function(error) {
            $ionicLoading.hide();
            //Error
            console.log(error);
        });
    }

    function atualizarUsuario(displayName) {
        var ref = firebase.database().ref('usuarios/' + firebaseUser.uid + '/displayName');

        var obj = $firebaseObject(ref);

        obj.$value = displayName;

        obj.$save().then(function(ref) {
            ref.key === obj.$id; // true
            console.log('Nome do usuário atualizado na base de dados.');
        }, function(error) {
            console.log("Error:", error)
        });
    }

    $scope.atualizarSenha = function(password) {
        $scope.authObj.$updatePassword(password)
            .then(function() {
                console.log("Password changed successfully!");
            }).catch(function(error) {
                console.error("Error: ", error);
            });
    }
});