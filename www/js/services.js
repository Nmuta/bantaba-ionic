angular.module('starter.services', [])
.factory('User', function(){
  var user = {
    username:null,
    loggedin:false,
    accountType:null,
    id:null
  }

  return {
    getCurrUser: function(){
      return user;
    },
    login: function(userInfo){
      user.username=userInfo.username;
      user.loggedin=true;
      user.id=userInfo.id
      accountType=userInfo.accountType;
    },
    logout: function(){
      user.username=null
      user.loggedin=false
      user.accountType=null
      user.id=null

    }
  }
})
.factory('Data', function(User, $http){

  var data={
    events:{},
    performers:{},
    following:{}
  }
  var selected={
    events:null,
    performers:null
  }
  return {
    update:function(){
      return $http.get('http://localhost:3000/events/').then(function(res){
        return $http.get('http://localhost:3000/performers/').then(function(res2){
          res.data.forEach(function(event){
            data.events[event.id]=event;
          })
          res2.data.forEach(function(performer){
            data.performers[performer.id]=performer;
          })
          return $http.get(`http://localhost:3000/users/following/${User.getCurrUser().id}`).then(function(res){
            data.following={ events:res.data.events,
              performers:res.data.performers
            }
          })
        })
      })
    },

    getData:function(){
      return data
    },
    select:function(type, id){
      selected[type]=id;
    },
    getSelected:function(type){
      return data[type][selected[type]]
    },
    getEventsPerformers:function(event){
      return $http.get(`http://localhost:3000/events/performers/${event.id}`).then(function(res){
        var performers={}
        res.data.forEach(function(performer){
          performers[performer.id]=performer;
        })
        return performers;
      })
    }
  }
})
