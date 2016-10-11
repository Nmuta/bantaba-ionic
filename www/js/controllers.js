angular.module('starter.controllers', ['ionic.cloud'])

.controller('DashCtrl', function($scope, $ionicPush, $state,Data, $http, User) {
  $ionicPush.register().then(function(t) {
    return $ionicPush.saveToken(t);
  }).then(function(t) {
    console.log('Token saved:', t.token);
  });
  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log("entered dash view");
    User.loggedRedirect();
    $scope.view.user=User.getCurrUser()
    Data.getInState().then(function(res){
      console.log(res);
      $scope.view.events=res.data;
    })

  })
  $scope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    alert(msg.title + ': ' + msg.text);
  }); //you should probably rework this in some way, either have it always pop up on all the view, or just a little notification tab or something
        //I like the notification tab thing... - show unread ones for each performer you're following..... little number next to them or whatever

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
.controller('loginCtrl', function($scope, $stateParams, $ionicAuth,$ionicPush, $http, User, Data, $location, $state){
  console.log("stuff");

  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    $scope.view={}
    console.log("get ready for login");
  })
  $scope.login=function(){
    $http.post(Data.url()+'/auth/login', {
      username:$scope.view.username,
      password:$scope.view.password,
    }).then(function(res){

      if(res.data.error===true){
        console.log(res.data);
      $scope.view.errormessage=res.data.message;
      }
      else{
        console.log(res.data);
        var loginData = {'username': $scope.view.username, 'password': $scope.view.password};
        var loginOptions = {'inAppBrowserOptions': {'hidden': true}};
        console.log("here, in this spot specifically  ");
        $ionicAuth.login('custom', loginData, loginOptions).then(function(res2){
          console.log("this stuff");
          console.log(res2);

          $ionicPush.register().then(function(t) {
            return $ionicPush.saveToken(t);
          }).then(function(t) {
            console.log('Token saved:', t.token);
          });
        });
        window.localStorage.setItem("token", res.data.token);
        User.login(res.data)
        $scope.view={}
        $state.go('tab.dash')

      }
    })
  }

})
.controller('registerCtrl', function($scope,$state, Data, $ionicPush, $ionicAuth, $stateParams, $http, User){

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
    $http.post(Data.url()+'/auth/signup', {
      username:$scope.view.username,
      password:$scope.view.password,
      accountType:$scope.view.accountType,
      state:$scope.view.state
    }).then(function(res){
      console.log(res.data);
      var loginData = {'username': $scope.view.username, 'password': $scope.view.password};
      var loginOptions = {'inAppBrowserOptions': {'hidden': true}};
      console.log("here, in this spot specifically  ");
      $ionicAuth.login('custom', loginData, loginOptions).then(function(res2){
        console.log("this stuff");
        console.log(res2);
        window.localStorage.setItem("token", res.data.token);
        User.login(res.data)
        $scope.view={}
        $ionicPush.register().then(function(t) {
          return $ionicPush.saveToken(t);
        }).then(function(t) {
          console.log('Token saved:', t.token);
        });
        $state.go('tab.dash')
      });

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
    $scope.user=User.getCurrUser()
    $scope.update();
  })
  $scope.update=function(){
    console.log("doing request");
    Data.updateFollowed().then(function(following){
      $scope.following=following;
      console.log($scope.following);
    })
  }
  $scope.showEvent=function(event){
    Data.select('events',event)
    $state.go('tab.event-show')
  }
  $scope.showPerformer=function(performer){
    Data.select('performers',performer)
    $state.go('tab.performer-show')
  }
})
.controller('listCtrl', function($scope, $http, $state, User, Data){
  $scope.view={
    editingFilter:false
  }

  $scope.data={}
  $scope.view.search={apply:false};
  $scope.$on('$ionicView.enter',function(){
    User.loggedRedirect();
    $scope.getAll();
    console.log("entered list view");
  })
  $scope.getAll=function(){
    Data.getList().then(function(res){
      $scope.data=res.data
    })
  }
  $scope.showEvent=function(event){
    Data.select('events',event)
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
  }
  $scope.toAccount=function(){
    console.log("switching states");
    $state.go('tab.account')
  }
  $scope.editFilter=function(){
    $scope.view.editingFilter=!$scope.view.editingFilter
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
  $scope.toList=function(){
    $state.go('list')
  }
})
.controller('EventDisplay', function($scope, $http, $ionicPopup, $state, User, Data){
  $scope.view={}

  $scope.$on('$ionicView.enter',function(){
    console.log('here');
    User.loggedRedirect();
    $scope.user=User.getCurrUser();
    $scope.view.event=Data.getSelected('events')
    console.log($scope.view.event);
    Data.updateFollowed().then(function(data){
      console.log(data);
        $scope.view.following= data.events.filter(function(event){
          return (event.event_id===$scope.view.event.id);
        }).length>0;
    })
    if($scope.user.accountType===3){
      $http.get(`${Data.url()}/users/profile/${window.localStorage.getItem('token')}`).then(function(res){
        if(res.data){

          $scope.view.performer=res.data[0];
          console.log($scope.view.performer);
          $http.get(`${Data.url()}/performers/performances/${$scope.view.performer.id}`).then(function(res){
            console.log(res.data);

            $scope.view.performing=(res.data.filter(function(event){
              return event.id===$scope.view.event.id
            }).length>0)


          })

        }
      })
    }
    $scope.view.event.start=new Date($scope.view.event.start);
    $scope.view.event.end=new Date($scope.view.event.end);
    Data.getEventsPerformers($scope.view.event).then(function(performers){
      console.log(performers);
      $scope.view.event.performers=performers
      console.log($scope.view.event.performers)
    });
  })
  $scope.follow=function(){
    $http.get(`${Data.url()}/users/followE/${window.localStorage.getItem('token')}/${$scope.view.event.id}`).then(function(res){
      if(res.data){
        Data.setFollowed(res.data);
        $scope.view.following=true;
      }
    })
  }
  $scope.unFollow=function(){
    $http.get(`${Data.url()}/users/unfollowE/${window.localStorage.getItem('token')}/${$scope.view.event.id}`).then(function(res){
      if(res.data){
        Data.setFollowed(res.data);
        $scope.view.following=false;
      }
    })
  }
  $scope.addPerformance=function(){
    $http.get(`${Data.url()}/users/addPerformance/${window.localStorage.getItem('token')}/${$scope.view.event.id}`).then(function(res){
      if(res.data){
        $scope.view.performing=true;
      }
    })
  }
  $scope.removePerformance=function(){
    $http.get(`${Data.url()}/users/removePerformance/${window.localStorage.getItem('token')}/${$scope.view.event.id}`).then(function(res){
      if(res.data){
        $scope.view.performing=false;
      }
    })
  }
  $scope.edit=function(){
    if($scope.view.editing===true){
      $http.post(Data.url()+'/events/update/'+$scope.view.event.id+"/"+window.localStorage.getItem('token'), {
        name:$scope.view.event.name,
          city:$scope.view.event.city,
          address:$scope.view.event.address,
          startDate:$scope.view.event.start.toString(),
          endDate:$scope.view.event.end.toString(),
          state:$scope.view.event.state
      })
      console.log($scope.view.performer);
      console.log("doing request now");
    }
    $scope.view.editing=!$scope.view.editing
  }
  $scope.confirmDelete = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Person',
       template: 'Are you sure you want to delete this event?'
     });

     confirmPopup.then(function(res) {
       if(res) {
         $http.get(Data.url()+'/events/delete/'+$scope.view.event.id+"/"+window.localStorage.getItem('token')).then(function(res){
           $state.go('tab.show')

         })
       }
     });
   };
   $scope.toList=function(){
     $state.go('list')
   }
  $scope.toSearch=function(){
    $state.go('tab.show')
  }
})
.controller('PerformerDisplay', function($scope, $http, $ionicPopup, $state, User, Data){
  $scope.view={}
  $scope.$on('$ionicView.enter',function(){
    console.log('here');
    User.loggedRedirect();
    $scope.user=User.getCurrUser();
    $scope.view.performer=Data.getSelected('performers')
    $http.get(`${Data.url()}/performers/notifications/${$scope.view.performer.id}`).then(function(res){
     console.log(res);
     $scope.view.notifications=res.data;
    })
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
    $http.get(`${Data.url()}/users/followP/${window.localStorage.getItem('token')}/${$scope.view.performer.id}`).then(function(res){
      if(res.data){
        Data.setFollowed(res.data);
        $scope.view.following=true;
      }
    })
  }
  $scope.toList=function(){
    $state.go('list')
  }
  $scope.unFollow=function(){
    $http.get(Data.url()+`/users/unfollowP/${window.localStorage.getItem('token')}/${$scope.view.performer.id}`).then(function(res){
      if(res.data){
        Data.setFollowed(res.data);
        $scope.view.following=false;
      }
    })
  }
  $scope.edit=function(){
    if($scope.view.editing===true){
      $http.post(Data.url()+'/performers/update/'+$scope.view.performer.id+"/"+window.localStorage.getItem('token'), {
        name:$scope.view.performer.name,
        bio:$scope.view.performer.bio,
        state:$scope.view.performer.state
      })
      console.log($scope.view.performer);
      console.log("doing request now");
    }
    $scope.view.editing=!$scope.view.editing
  }
  $scope.confirmDelete = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Event',
       template: 'Are you sure you want to delete this event?'
     });

     confirmPopup.then(function(res) {
       if(res) {
         $http.get(Data.url()+'/performers/delete/'+$scope.view.performer.id+"/"+window.localStorage.getItem('token')).then(function(res){
           $state.go('tab.show')

         })
       }
     });
   };
  $scope.toSearch=function(){
    $state.go('tab.show')
  }
})
.controller('AccountCtrl', function($scope, $state, $http, Data, User) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.logout=function(){
    User.logout();
    window.localStorage.removeItem("token");
    User.loggedRedirect();
  }
  $scope.view={}
  $scope.view.performer={}
  $scope.view.events={}
  $scope.notification={}
  $scope.$on('$ionicView.enter', function(){
    $scope.user=User.getCurrUser();
    $scope.view.showNoti=false
    if($scope.user.accountType===3){
      $http.get(`${Data.url()}/users/profile/${window.localStorage.getItem('token')}`).then(function(res){
        if(res.data){
          console.log(res.data);
          $scope.view.performer=res.data[0];
          console.log($scope.view.performer);
          $http.get(`${Data.url()}/performers/performances/${$scope.view.performer.id}`).then(function(res){
            console.log(res);
            $scope.view.events=res.data
          })

        }
      })
    }
    $scope.view.createEvent=false;

  })
  $scope.toCreateEvent=function(){
    $state.go('new-event')
  }
  $scope.toCreatePerformer=function(){
    $state.go('new-performer')
  }
  $scope.submitNotification=function(){
    if($scope.notification.text){
      console.log($scope.notification);
      $http.post(Data.url()+'/performers/notify/'+$scope.view.performer.id+"/"+window.localStorage.getItem('token'), $scope.notification).then(function(){
        console.log('whatever');
        $scope.notification={};
      })
    }
  }
  $scope.edit=function(){
    if($scope.view.editing===true){
      $http.post(Data.url()+'/performers/update/'+$scope.view.performer.id+"/"+window.localStorage.getItem('token'), {
        name:$scope.view.performer.name,
        bio:$scope.view.performer.bio,
        state:$scope.view.performer.state
      })
      console.log($scope.view.performer);
      console.log("doing request now");
    }
    $scope.view.editing=!$scope.view.editing
  }
  $scope.toList=function(){
    $state.go('list')
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
  $scope.showNotifications=function(){
    //do request here... display... write edit and delete routes...
    if(!$scope.view.showNoti){
      $http.get(`${Data.url()}/performers/notifications/${$scope.view.performer.id}`).then(function(res){
       console.log(res);
       $scope.view.notifications=res.data;
       console.log($scope.view.notifications);
      })
    }
    $scope.view.showNoti=!$scope.view.showNoti
  }
  //show notifications, allow to edit and delete, re-order maybe... --gets clutttered really damn fast ya know
})
.controller('SplashCtrl', function($scope, $state, Data, $ionicPush, $http, User) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.$on('$ionicView.enter',function(){
    console.log("here");
    var token=window.localStorage.getItem("token");
    console.log(token);
    if(token){
      $http.post(Data.url()+'/auth/getUser', {token:token}).then(function(res){
        console.log("this");
        if(res.data.error!=true){
          console.log(res.data);
          User.login(res.data)
          $state.go('tab.dash')
        }
      })
    }
    $ionicPush.register().then(function(t) {
      return $ionicPush.saveToken(t);
    }).then(function(t) {
      console.log('Token saved:', t.token);
    });
  })
})
.controller('NewEventCtrl', function($scope, Data, $state, $http, User){
  $scope.$on('$ionicView.enter', function(){
    console.log("sfhaflkjasfhjkasfjlasdf");
    $scope.input={}
  })
  $scope.toAccount=function(){
    $state.go('tab.account')
  }
  $scope.submitEvent=function(){
    $http.post(Data.url()+'/events/create', {token:window.localStorage.getItem('token'),   name:$scope.input.name,
      city:$scope.input.city,
      address:$scope.input.address,
      startDate:$scope.input.startDate.toString(),
      endDate:$scope.input.endDate.toString(),
      state:$scope.input.state}).then(function(res){
      console.log(res);
      $state.go('tab.account')
    })
  }
})
.controller('NewPerformerCtrl', function($scope, Data, $state, $http, User){
  $scope.$on('$ionicView.enter', function(){
    $scope.input={}
  })
  $scope.toAccount=function(){
    $state.go('tab.account')
  }
  $scope.submitPerformer=function(){
    $http.post(Data.url()+'/performers/create', {token:window.localStorage.getItem('token'),   name:$scope.input.name,
      username:$scope.input.username,
      password:$scope.input.password,
      bio:$scope.input.bio,
      state:$scope.input.state}).then(function(res){
      console.log(res);
      $state.go('tab.account')
    })
  }
})
;
