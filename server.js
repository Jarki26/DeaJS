var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path')

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }  
	var contentType;
	switch(path.extname(filename)){
		case ".css":
			contentType = "text/css";
			break;
		case ".js":
			contentType = "application/javascript";
			break;
		default:
			contentType = "text/html";
	}
    res.writeHead(200, {'Content-Type': contentType});
    res.write(data);
    return res.end();
  });
}).listen(3000);