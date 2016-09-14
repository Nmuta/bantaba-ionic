angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, User) {
  $scope.view={}
  $scope.data="this is a test"
  $http.post('http://localhost:3000/auth/getUser', {token:window.localStorage.getItem('token')}).then(function(res){
    if(res.data.error!=true){
      console.log(res.data);
      User.login(res.data)
    }
  })
  $scope.$on('$ionicView.enter',function(){
    console.log("entered dash view");
    $scope.view.user=User.getCurrUser()

  })
  $scope.testLogin=function(){
    console.log($scope.view.user);
    $http.post('http://localhost:3000/auth/getUser', {token:window.localStorage.getItem('token')}).then(function(res){
      console.log(res.data);
      // if(res.data.error!=true){
      //   console.log(res.data);
      //   User.login(res.data)
      //   $location.path('/tab/dash');
      // }
    })
  }
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
.controller('loginCtrl', function($scope, $stateParams, $http, User, $location, $state){
  console.log("stuff");

  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log("get ready for login");
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
      if(res.data.error===true){
        console.log(res.data);
      $scope.view.errormessage=res.data.message;
      }
      else{
        console.log(res.data);
        window.localStorage.setItem("token", res.data.token);
        User.login(res.data)
        $state.go('tab.dash')
      }
    })
  }

})
.controller('registerCtrl', function($scope, $stateParams, $http, User){
  console.log("stuff");

  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log("get ready for login");

  })
  $scope.signup=function(){
    console.log("gonna signup");
    console.log($scope);
    console.log($scope.view.username);
    console.log($scope.view.password);
    console.log($scope.view.accountType);
    $http.post('http://localhost:3000/auth/signup', {
      username:$scope.view.username,
      password:$scope.view.password,
      accountType:$scope.view.accountType
    }).then(function(res){
      window.localStorage.setItem("token", res.data.token);
      User.login(res.data)
    })
  }
  $scope.log=function(){
    console.log("gonna signup");
    console.log($scope);
    console.log($scope.view.username);
    console.log($scope.view.password);
    console.log($scope.view.accountType);
  }
})
.controller('followingCtrl', function($scope, $http,Data,User){
  $scope.following={}

  $scope.$on('$ionicView.enter',function(){
    console.log("hideKeyboardAccessoryBar");
    $scope.user=User.getCurrUser()
    $scope.update();
  })
  $scope.update=function(){
    console.log("doing request");
    if($scope.user.loggedin===true){
      Data.update().then(function(res){
        $scope.following=Data.getData().following;
        console.log($scope.following);
      })
    }
    else{
      $scope.following={};
      console.log('not logged in');
    }
  }

})
.controller('showCtrl', function($scope, $http, $state, User, Data){
  $scope.view={}
  $scope.data={}
  $scope.$on('$ionicView.enter',function(){
    $scope.getAll();
  })
  $scope.getAll=function(){
    Data.update().then(function(){
      $scope.data=Data.getData()
      console.log($scope.data);
    })

  }
  $scope.showEvent=function(event){
    Data.select('events',event.id)
    console.log('this');
    $state.go('tab.event-show')
  }
  $scope.showPerformer=function(performer){
    Data.select('performers',performer.id)
    $state.go('tab.performer-show')
  }
})
.controller('EventDisplay', function($scope, $http, $state, User, Data){
  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log('here');

    $scope.view.event=Data.getSelected('events')
    console.log($scope.view.event);
    Data.getEventsPerformers($scope.view.event).then(function(performers){
      console.log(performers);
      $scope.view.event.performers=performers
      console.log($scope.view.event.performers)
    });
  })
  $scope.follow=function(){
    $http.get(`http://localhost:3000/users/followE/${window.localStorage.getItem('token')}/${$scope.view.event.id}`).then(function(res){
      console.log(res);
    })
  }
})
.controller('PerformerDisplay', function($scope, $http, $state, User, Data){
  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log('here');

    $scope.view.performer=Data.getSelected('performers')
    console.log($scope.view.performer);

  })
})
.controller('AccountCtrl', function($scope, $http, User) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.logout=function(){
    User.logout();
    window.localStorage.removeItem("token");
  }
});
