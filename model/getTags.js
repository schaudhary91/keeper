module.exports = function (serviceNS){
  return function(req, res, next){
    console.log("Getting tags");
    var param = {};
    param = req.body.name && req.body.name || param;
    serviceNS.getCollection('tag').find(param).toArray(function(er, result){
      if(!er){
        res.send(result);
      } else {
        console.log('Error fetching tags');
      }
    });
  }
}
