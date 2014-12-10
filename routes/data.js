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
    var tags = [
      {
        "title":"This is Title",
        "text":"some selected text.",
        "tags":["test","dummy","xyz"],
        "uid":"s3456x",
        "fullurl":"http://www.google.com"
      },
      {
        "title":"This is Title x",
        "text":"some selected text. some selected text. some selected text. some selected text. some selected text.",
        "tags":["test","long","xyz"],
        "uid":"s1234x",
        "fullurl":"http://www.google.com"
      },
      {
        "title":"This is Title y",
        "text":"some selected text.",
        "tags":["test","sha"],
        "uid":"s1234x",
        "fullurl":"http://www.google.com"
      },
      {
        "title":"This is Title z",
        "text":"some selected text. some selected text. some selected text. some selected text. some selected text.",
        "tags":["test","sand","xyz"],
        "uid":"s3456x",
        "fullurl":"http://www.google.com"
      }
    ];

    getCollection('tusers').remove({},function(er){
      if(!er){
        console.log('tusers deleted');
      }
    });
    getCollection('ttags').remove({},function(er){
      if(!er){
        console.log('ttags deleted');
      }
    });
    for(var i = 0; i<users.length; i++){
      getCollection('tusers').insert(users[i],function(er){
        if(!er){
          console.log('tusers created');
        }
      });
    }
    for(var j = 0; j<tags.length; j++){
      getCollection('ttags').insert(tags[j],function(er){
        if(!er){
          console.log('ttags created');
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
