
// test URL --/21/3/5/121.5372111/25.067934

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
var schemaOptions = {
    toJSON: {virtuals: true}
    , id: false
};
var trashSchema = new mongoose.Schema({
    CarTime: String,  
    Adddress: String,
    Loc: {Lng:Number,Lat:Number},
}, schemaOptions);

trashSchema.index({
 loc: "2d"
});

/*additional conlumns*/
//trashSchema.virtual('name').get(function () {
//    return this.title.substring(6, this.title.length);
//});
//trashSchema.virtual('time').get(function () {
//    return this.dep_content.substring(this.dep_content.length-11, this.dep_content.length);
//});

trashSchema.virtual('location').get(function () {
    return this.Loc.Lat + ',' + this.Loc.Lng;
});

var Trash = mongoose.model('trash2014', trashSchema, 'trash2014');


var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);
app.get('/:hour/:num/:dist/:lng/:lat', function (req, res) {
    res.type('application/json');
    
    var lng = req.params.lng;
    var lat = req.params.lat;
    var hour= req.params.hour+":";
    var num = req.params.num;
    var distance = req.params.dist / 111.2; // 5 km
    
    var search = new RegExp(hour, "i");

    var query = Trash.find({ Loc: {'$near':[lng, lat], $maxDistance: distance} })
                     .where('CarTime').regex(search)
                     .limit(num);

    query.exec(function(err, trashs) {
         if(!err){
            //console.log(trashs);
            res.json(trashs);
         }else{
            res.end('Error:' + err);
         }
    });

});

// Launch server
var port = process.env.PORT || 8080 
    , ip = process.env.IP || "127.0.0.1";

//var port = process.env.OPENSHIFT_NODEJS_PORT || 8080  
//  , ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

app.listen(port, ip);

