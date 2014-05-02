
//http://andycheng.kd.io:3412/21/3/121.5372111/25.067934

var mongoose = require ("mongoose");
var express = require('express');

var app = express();

// Database
var uristring = "mongodb://admin:admin@troup.mongohq.com:10004/app14827746";
mongoose.connect(uristring,  function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// Mongoose ORM
var trashSchema = new mongoose.Schema({
    //unit: String,
    title: String,  
    dep_content: String,
    loc: {lng:Number,lat:Number},
    //modifydate: String
});

trashSchema.index({
 loc: "2d"
});

var Trash = mongoose.model('Trash', trashSchema, 'Trash');

app.get('/:hour/:num/:lng/:lat', function (req, res) {
    res.type('application/json');
    
    var lng = req.params.lng;
    var lat = req.params.lat;
    var hour= req.params.hour+":";
    var num = req.params.num;
    
    var re = new RegExp(hour, "i");

    var query = Trash.find({ loc: {'$near':[lng, lat]} })
                     .where('dep_content').regex(re)
                     .limit(num);
    query.exec(function(err, trashs) {
         if(!err){
            //mongoose.connection.close();
            console.log(trashs);
            res.json(trashs);
         }else{
            //res.send(err,callback);
            res.end('Error:' + err);
         }
    });

});

// Launch server
//var port = process.env.PORT || 8080 ; 
//, ip = process.env.IP || "127.0.0.1";

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080  
 , ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

app.listen(port, ip);

//app.listen(OPENSHIFT_NODEJS_PORT || 8080);


