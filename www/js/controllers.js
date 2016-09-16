angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state,Data, $http, User) {

  $scope.view={}
  $scope.data="this is a test"

  $scope.$on('$ionicView.enter',function(){
    console.log("entered dash view");
    User.loggedRedirect();
    $scope.view.user=User.getCurrUser()
    Data.getInState().then(function(res){
      console.log(res);
        $scope.view.events=res.data;
    })
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
  $scope.logout=function(){
    User.logout();
    User.loggedRedirect();
    window.localStorage.removeItem("token");
    User.loggedRedirect();

  }
  $scope.showEvent=function(event){
    Data.select('events',event)
    console.log('this');
    $state.go('tab.event-show')
  }
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
.controller('registerCtrl', function($scope,$state,  $stateParams, $http, User){
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
      accountType:$scope.view.accountType,

    }).then(function(res){
      window.localStorage.setItem("token", res.data.token);
      User.login(res.data)
      $state.go('tab.following')
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
.controller('followingCtrl', function($scope, $state, $http,Data,User){
  $scope.following={}

  $scope.$on('$ionicView.enter',function(){
    User.loggedRedirect();
    console.log("hideKeyboardAccessoryBar");
    $scope.user=User.getCurrUser()
    $scope.update();
  })
  $scope.update=function(){
    console.log("doing request");
    if($scope.user.loggedin===true){
      Data.updateFollowed().then(function(following){
        $scope.following=following;
        console.log($scope.following);
      })
    }
    else{
      $scope.following={};
      console.log('not logged in');
    }
  }
  $scope.showEvent=function(event){
    Data.select('events',event)
    console.log('this');
    $state.go('tab.event-show')
  }
  $scope.showPerformer=function(performer){
    Data.select('performers',performer)
    $state.go('tab.performer-show')
  }
})
.controller('showCtrl', function($scope, $http, $state, User, Data){
  $scope.view={}
  $scope.data={}
  $scope.view.search={};
  $scope.$on('$ionicView.enter',function(){
    User.loggedRedirect();

  })
  $scope.getAll=function(){
    Data.update().then(function(){
      $scope.data=Data.getData()
      console.log($scope.data);
    })
  }
  $scope.showEvent=function(event){
    Data.select('events',event)
    console.log('this');
    $state.go('tab.event-show')
  }
  $scope.showPerformer=function(performer){
    Data.select('performers',performer)
    $state.go('tab.performer-show')
  }
  $scope.doSearch=function(){
    console.log('here');
    console.log($scope.view.search);
    Data.search($scope.view.search).then(function(out){
      $scope.data=out;
    })
    //do the different api requests based on selected option
  }
})
.controller('EventDisplay', function($scope, $http, $state, User, Data){
  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log('here');
    User.loggedRedirect();

    $scope.view.event=Data.getSelected('events')
    console.log($scope.view.event);
    Data.updateFollowed().then(function(data){
        $scope.view.following= data.events.indexOf($scope.view.event)!=-1
    })

    Data.getEventsPerformers($scope.view.event).then(function(performers){
      console.log(performers);
      $scope.view.event.performers=performers
      console.log($scope.view.event.performers)
    });
  })
  $scope.follow=function(){
    $http.get(`http://localhost:3000/users/followE/${window.localStorage.getItem('token')}/${$scope.view.event.id}`).then(function(res){
      if(res.data){
        Data.setFollowed(res.data);
        $scope.view.following=true;
      }
    })
  }
  $scope.unFollow=function(){
    $http.get(`http://localhost:3000/users/unfollowE/${window.localStorage.getItem('token')}/${$scope.view.event.id}`).then(function(res){
      if(res.data){
        Data.setFollowed(res.data);
        $scope.view.following=false;
      }
    })
  }
  $scope.toSearch=function(){
    $state.go('tab.show')
  }
})
.controller('PerformerDisplay', function($scope, $http, $state, User, Data){
  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log('here');
    User.loggedRedirect();
    $scope.view.performer=Data.getSelected('performers')
    Data.updateFollowed().then(function(data){
      console.log(data);
        $scope.view.following=false
        for(var i=0; i<data.performers.length; i++){
          if(data.performers[i].performer_id===$scope.view.performer.performer_id){
            $scope.view.following=true
          }
        }
    })

    console.log($scope.view.performer);

  })
  $scope.follow=function(){
    $http.get(`http://localhost:3000/users/followP/${window.localStorage.getItem('token')}/${$scope.view.performer.id}`).then(function(res){
      if(res.data){
        Data.setFollowed(res.data);
        $scope.view.following=true;
      }
    })
  }
  $scope.unFollow=function(){
    $http.get(`http://localhost:3000/users/unfollowP/${window.localStorage.getItem('token')}/${$scope.view.performer.id}`).then(function(res){
      if(res.data){
        Data.setFollowed(res.data);
        $scope.view.following=false;
      }
    })
  }
  $scope.toSearch=function(){
    $state.go('tab.show')
  }
})
.controller('AccountCtrl', function($scope, $state, $http, User) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.logout=function(){
    User.logout();
    User.loggedRedirect();
    window.localStorage.removeItem("token");
    User.loggedRedirect();
  }
  $scope.view={}
  $scope.$on('$ionicView.enter', function(){
    $scope.user=User.getCurrUser();
    $scope.view.createEvent=false;
  })
  $scope.toCreateEvent=function(){
    $state.go('new-event')
  }
})
.controller('SplashCtrl', function($scope, $state, $http, User) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.$on('$ionicView.enter',function(){
    console.log("here");
    var token=window.localStorage.getItem("token");
    console.log(token);
    if(token){
      $http.post('http://localhost:3000/auth/getUser', {token:token}).then(function(res){
        console.log("this");
        if(res.data.error!=true){
          console.log(res.data);
          User.login(res.data)
          $state.go('tab.dash')
        }
      })
    }
  })
  $scope.logout=function(){
    User.logout();
    User.loggedRedirect();
    window.localStorage.removeItem("token");
    User.loggedRedirect();

  }
})
.controller('NewEventCtrl', function($scope, $state, $http, User){
  $scope.$on('$ionicView.enter', function(){
    console.log("sfhaflkjasfhjkasfjlasdf");
    $scope.input={}
  })
  $scope.toAccount=function(){
    $state.go('tab.account')
  }
  $scope.logInput=function(){
    console.log($scope.input);
    console.log(typeof $scope.input.endDate);
    console.log($scope.input.endDate.toString());
    console.log($scope.input);
    console.log(typeof $scope.input.endDate);
  }
  $scope.submitEvent=function(){
    //do post request here,

    $http.post('http://localhost:3000/events/create', {token:window.localStorage.getItem('token'),   name:$scope.input.name,
      city:$scope.input.city,
      address:$scope.input.address,
      startDate:$scope.input.startDate.toString(),
      endDate:$scope.input.endDate.toString(),
      state:$scope.input.state}).then(function(res){
      console.log(res);
      $state.go('tab.account')
      //redirect to wherever
    })
  }
})
;
