module.exports = function (serviceNS){
  return function(req, res) {
    var user = [
    {
      "email":"skumar@gmail.com",
      "firstname":"shashaank",
      "lastname":"kumar",
      "uid":"s1234x",
      "uname":"skum"
    },
    {
      "email":"scha@gmail.com",
      "firstname":"sandeep",
      "lastname":"chaudhary",
      "uid":"s3456x",
      "uname":"scha"
    }
    ];

    serviceNS.getCollection('tusers').remove({},function(er){
      if(!er){
        console.log('tusers deleted');
      }
    });
    for(var i = 0; i<user.length; i++){
      serviceNS.getCollection('tusers').insert(user[i],function(er){
        if(!er){
          console.log('tusers created');
        }
      });
    }
    res.send('.....................');
  }
}
