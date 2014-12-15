var express = require('express'),
    router = express.Router(),
    mongoskin = require('mongoskin'),
    serviceNS = serviceNS || {
      db : mongoskin.db('mongodb://@localhost:27017/keeper', {safe:true}),
      getCollection : function (cname){
        return this.db.collection(cname);
      }
    },
    loadModel = function (name){
      return require('../model/'+name)(serviceNS);
    };

/* GET success true */
router.get('/', function(req, res) {
  res.send({success:true});
});

/* Generate test data */
router.get('/gentestd', loadModel('gentestd'));

/*Get Tags*/
router.get('/getTags', loadModel('getTags'));

module.exports = router;
