var express = require('express');

module.exports = function (app){

  var router = express.Router(),
  mongoskin = require('mongoskin');

  var db = mongoskin.db('mongodb://@localhost:27017/keeper', {safe:true})

  function getCollection(cname){
    return db.collection(cname);
  }

  function getData(cname,query,projection){
    getCollection(cname).find(query,projection);
  }

  app.param('cn', function(req, res, next, cn){
    req.collection = getCollection(cn);
    return next();
  })

  /* GET success true */
  router.get('/', function(req, res) {
    res.send({success:true});
  });

  /* Generate test data */
  router.get('/gentestd', function(req, res) {
    var users = [
      {"firstname":"shashaank","lastname":"kumar","uid":"skum"},
      {"firstname":"sandeep","lastname":"chaudhary","uid":"scha"}
    ];


    getCollection('tusers').remove({},function(er){
      if(!er){
        console.log('tusers deleted');
      }
    });

    for(var i = 0; i<users.length; i++){
      getCollection('tusers').insert(users[i],function(er){
        if(!er){
          console.log('tusers created');
        }
      });
    }
    res.send('.....................');
  });

  /* GET Collection Data */
  router.get('/:cn', function(req, res, next) {
    getCollection(req.params.cn).find({} ,{limit:0, sort: [['_id',-1]]}).toArray(function(e, results){
      if (e) {
        return next(e);
      }
      res.send(results);
    })
  });

  /* GET Collection Data by key : val*/
  router.get('/:cn/:key/:val', function(req, res, next) {
    var fobj = {};
    fobj[req.params.key] = req.params.val;
    getCollection(req.params.cn).find(fobj ,{limit:0, sort: [['_id',-1]]}).toArray(function(e, results){
      if (e) {
        return next(e);
      }
      res.send(results);
    })
  });

  return router;

};
