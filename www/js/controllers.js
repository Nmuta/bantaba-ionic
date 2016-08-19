angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {
  console.log("here");
  $scope.data="this is a test"

  $scope.$on('$ionicView.enter',function(){
    console.log("entered dash view");
    $http.get('http://localhost:3000/').then(function(res){
      console.log(res);
    })
  })
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.$on('$ionicView.enter',function(){
    console.log("entered chats view");
  })
  console.log("in the chat");
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
.controller('loginCtrl', function($scope, $stateParams, $http){
  console.log("stuff");

  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log("get ready for login");
    $scope.view.username="joe"
  })
  $scope.login=function(){
    console.log("gonna login");
    console.log($scope);
    console.log($scope.view.username);
    console.log($scope.view.password);
    $http.post('http://localhost:3000/auth/login', {
      username:$scope.view.username,
      password:$scope.view.password,
    }).then(function(res){
      console.log(res);
    })
  }
  $scope.signup=function(){
    console.log("gonna login");
    console.log($scope);
    console.log($scope.view.username);
    console.log($scope.view.password);
    $http.post('http://localhost:3000/auth/login', {
      username:$scope.view.username,
      password:$scope.view.password,
    }).then(function(res){
      console.log(res);
    })
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});