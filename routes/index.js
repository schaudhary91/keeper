var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/*GET Hello World*/
router.get('/hw', function(req, res) {
  res.render('hw', { title: 'Hello World' });
});


module.exports = router;
