var exec = require('child_process').exec;
var request = require('superagent');
var fs = require('fs');
var Nightmare = require('nightmare');
var cheerio = require('cheerio');
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

console.log('start');

var nightmare = new Nightmare();

var parse = function(halfSum, nextSum) {
  console.log("sum = " + (Number(halfSum) + Number(nextSum)));
};

nightmare
  .use(Speiyou.fetch())
  .run(function(err, nightmare) {
    if (err) return console.log();
    console.log();
  });