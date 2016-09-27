angular.module('starter.filters',[])
.filter('eventFilter', function() {
  return function(input, search){
    if(search.apply===false){
      return input
    }
    else{
      var comparators=[];
      if(search.startsBefore){
        comparators.push(startsBefore);
      }
      if(search.startsAfter){
        comparators.push(startsAfter)
      }
      if(search.endsBefore){
        comparators.push(endsBefore)
      }
      if(search.endsAfter){
        comparators.push(endsAfter)
      }
      return input.filter(function(event){
        return comparators.reduce(function(result, next){
          return (result)? next(event) : false;
        },true)
      })
    }
    function startsBefore(event){
      return search.startsBefore>new Date(event.start)
    }
    function startsAfter(event){
      return search.startsAfter<new Date(event.start)
    }
    function endsBefore(event){
      return search.endsBefore>new Date(event.end)
    }
    function endsAfter(event){
      return search.endsAfter<new Date(event.end)
    }
  }

})


//take array of callbacks, apply all of them to each value, if any resolve to false, return
