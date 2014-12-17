module.exports = function (serviceNS){
  return function(req, res, next){
    console.log("Delete Content");
    serviceNS.getCollection('tag').remove({}, function(er, result){
      if(!er){
        console.log('Tags deleted successfull !!');
        res.send(result);
      } else {
        console.log('Error deleting tags');
      }
    });

    serviceNS.getCollection('note').remove({}, function(er, result){
      if(!er){
        console.log('Notes deleted successfull !!');
        res.send(result);
      } else {
        console.log('Error deleting notes');
      }
    });
  }
}
