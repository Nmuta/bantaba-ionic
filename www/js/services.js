angular.module('starter.services', [])
.factory('User', function($state){
  var user = {
    username:null,
    loggedin:false,
    accountType:null,
    id:null,
    state:null
  }

  return {
    getCurrUser: function(){
      return user;
    },
    login: function(userInfo){
      user.username=userInfo.username;
      user.loggedin=true;
      user.id=userInfo.id
      user.accountType=userInfo.accountType;
      user.state=userInfo.state;
    },
    logout: function(){
      user.username=null
      user.loggedin=false
      user.accountType=null
      user.id=null

    },
    loggedRedirect: function(){
      if(user.loggedin===false){
        $state.go('main')
      }
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
  var urls={
    hosted:'https://bantaba.herokuapp.com',
    local:'http://localhost:3000'
  }
  var enviroment= 'hosted'
  return {
    update:function(){
      return $http.get(urls[enviroment]+'/events/').then(function(res){
        return $http.get(urls[enviroment]+'/performers/').then(function(res2){
          res.data.forEach(function(event){
            data.events[event.id]=event;
          })
          res2.data.forEach(function(performer){
            data.performers[performer.id]=performer;
          })
          return $http.get(`${urls[enviroment]}/users/following/${User.getCurrUser().id}`).then(function(res){
            data.following={ events:res.data.events,
              performers:res.data.performers
            }
          })
        })
      })
    },
    getList:function(){
      return $http.get(urls[enviroment]+'/search/list/')
    },
    url:function(){
      return urls[enviroment]
    },
    updateFollowed:function(){
      return $http.get(`${urls[enviroment]}/users/following/${User.getCurrUser().id}`).then(function(res){
        data.following={ events:res.data.events,
          performers:res.data.performers
        }


        return data.following
      })
    },
    setFollowed:function(data){
      data.following=data
    },
    getFollowed:function(){
      return data.following
    },
    getInState:function(){
      return $http.get(urls[enviroment]+'/events/state/'+User.getCurrUser().state)
    },
    getData:function(){
      return data
    },
    select:function(type, object){
      selected[type]=object;
    },
    getSelected:function(type){
      return selected[type]
    },
    getEventsPerformers:function(event){
      return $http.get(urls[enviroment]+`/events/performers/${event.id}`).then(function(res){
        var performers={}
        res.data.forEach(function(performer){
          performers[performer.id]=performer;
        })
        return performers;
      })
    },
    search:function(search){
      console.log("in search");
      //if its a city, you'll have to try to parse that somehow.... (this will become more of issue as you go...)
      console.log(urls[enviroment]+`/search/${search.type}/${search.text}`);
      return $http.get(`${urls[enviroment]}/search/${search.type}/${search.text}`).then(function(res){
        console.log(res);
        var out={
          events:{},
          performers:{}
        };
        res.data.events.forEach(function(event){
          out.events[event.id]=event;
        })
        res.data.performers.forEach(function(performer){
          out.performers[performer.id]=performer;
        })
        return out;
      })
    }
  }
})
