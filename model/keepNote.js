module.exports = function (serviceNS){
  return function(req, res, next){
    var data = req.body;

    /* Save User */
    function saveUser(data){
      var user = JSON.parse(data.user);
      var query = {id: user.id}
      serviceNS.getCollection('user').update(query,{$set:user},{upsert:true},function (er,result){
        if(!er){
          // Call to save tags
          saveTag(data.tag);
          saveNote(data, user.id);
          res.send({"success": true});
        } else {
          console.log('Error updating user: ' + user.given_name + ' / ' + user.id);
          res.send({"success": false});
        }
      });
    }

    /* Save Tag */
    function saveTag(data){
      var query = {name: data};
      serviceNS.getCollection('tag').update(query,{$set:query},{upsert:true},function (er,result){
        if(!er){
          res.status({"success": true}).end();
        } else {
          console.log('Error updating tags: ' + data);
          console.log(er);
          res.status({"success": false}).end();
        }
      });
    }

    /* Save Note */
    function saveNote(data, uid){
      var noteData = {
              selection: data.selection,
              location: data.location,
              tag: data.tag,
              uid: uid
            }
      serviceNS.getCollection('note').insert(noteData,function (er,result){
        if(!er){
          res.status({"success": true}).end();
        } else {
          console.log('Error updating notes');
          res.status({"success": false}).end();
        }
      });
    }

    saveUser(data);
  }
}
