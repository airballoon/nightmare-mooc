var Nightmare = require('nightmare');
var speiyou = require('./lib/speiyou');
var mysql = require('mysql');

//http://sbj.speiyou.com/search/index/grade:0/level:bx/subject:/gtype:time/service:/time:/term:/period:/o:da/bg:n/curpage:2
/**
 * @grade [0,1,2,3...]
 * @level "bx"
 * @subject "*"
 * @gtype "time"
 * @service "*"
 * @time: "*"
 * @term "*"
 * @period "*"
 * @o "da"
 * @bg "n"
 * @curpage "4"
 */

var nightmare = new Nightmare();



var connection = mysql.createConnection({
  host     : '127.0.0.1',
  port     : 3306,
  database : 'blog',
  user     : 'blog',
  password : 'blog',
  charset  : 'UTF8'
});

connection.connect();

nightmare
  .use(speiyou.fetch(connection))
  .run(function(err, nightmare) {
  	if (err) return console.log(err);
  	console.log("over");
    connection.end();
  });
