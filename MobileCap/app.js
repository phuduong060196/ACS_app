var express = require('express');
var path = require('path')
var app = express();

app.use(express.static(path.resolve(__dirname, "www")));

app.use('/*', function(req, res){
  res.sendFile(__dirname+ '/www' + '/index.html');
});

app.set('port', process.env.PORT || 3003);
app.listen(app.get('port'), function() {
  console.log("listening to http://localhost:" + app.get("port"));
});
