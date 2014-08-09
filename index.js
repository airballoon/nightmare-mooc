var Nightmare = require('nightmare');
var speiyou = require('./lib/speiyou');

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

nightmare
  .use(speiyou.fetch())
  .run(function(err, nightmare) {
  	if (err) return console.log(err);
  	console.log("over");
  });
