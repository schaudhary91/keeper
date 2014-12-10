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

    if(db.tusers){
      db.tusers.remove({});
    }

    for(var i = 0; i<users.length; i++){
      getCollection('tusers').insert(users[i],function(er){
        if(!er){
          console.log('user created');
        }
      });
    }
    res.send('Test data created');
  });

  /* GET Collection Data */
  router.get('/:cn', function(req, res, next) {
    getCollection(req.params.cn).find({} ,{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
      if (e) {
        return next(e);
      }
      res.send(results);
    })
  });

  /* GET Collection Data by uid*/
  router.get('/:cn/uid/:uid', function(req, res, next) {
    getCollection(req.params.cn).find({uid:req.params.uid} ,{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
      if (e) {
        return next(e);
      }
      res.send(results);
    })
  });

  return router;

};
