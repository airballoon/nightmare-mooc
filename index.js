var Nightmare = require('nightmare');
var Speiyou = require('./lib/speiyou.js');

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

new Nightmare
  .use(Speiyou.fetch())
  .run();
