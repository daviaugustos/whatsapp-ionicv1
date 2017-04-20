app.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $ionicPopup) {

    $scope.usuario = {};

    $scope.authObj = $firebaseAuth();

    $scope.login = function(usuario) {

        $scope.authObj.$signInWithEmailAndPassword(usuario.email, usuario.password)
            .then(function(firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $state.go('tabs.profile');
            }).catch(function(error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Falha no Login',
                    template: error.message
                });
            });
    }
});

app.controller('RegistroCtrl', function($scope, $state, $firebaseAuth, $firebaseObject) {

    $scope.usuario = {};

    $scope.authObj = $firebaseAuth();

    $scope.registrar = function(usuario) {

        $scope.authObj.$createUserWithEmailAndPassword(usuario.email, usuario.password)
            .then(function(firebaseUser) {

                console.log("User " + firebaseUser.uid + " created successfully!");
                console.log("Complete user" + JSON.stringify(firebaseUser));

                addUsuario(firebaseUser);
                $state.go('login');

            }).catch(function(error) {
                console.error("Error: ", error);
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

app.controller('ProfileCtrl', function($scope, $state, $firebaseAuth, $firebaseObject) {

    $scope.authObj = $firebaseAuth();

    var firebaseUser = $scope.authObj.$getAuth();

    $scope.usuario = angular.copy(firebaseUser);

    $scope.logout = function() {
        $scope.authObj.$signOut();
        $state.go('login');
    }

    $scope.atualizar = function(usuario) {
        
        firebaseUser.updateProfile({            
            displayName: usuario.displayName
            //TODO: Atualizar Imagem...
        }).then(function(response) {
            console.log("ok" + response);
            atualizarUsuario(usuario.displayName);
        }, function(error) {
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