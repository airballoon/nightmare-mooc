var exec = require('child_process').exec;
var request = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

var city_map = [
];

var firstUrl = 'http://sbj.speiyou.com/search/index/subject:/grade:0/gtype:time';
var lastUrl = 'http://sbj.speiyou.com/search/index/grade:0/level:bx/subject:/gtype:time/service:/time:/term:/period:/o:da/bg:n/curpage:'

var halfSum = 0;
var nextSum = 0;

var fetch = exports.fetch = function() {
	return function(nightmare) {
    nightmare
    .goto(firstUrl)
  	.evaluate(function () {
      return document.getElementsByTagName('html')[0].innerHTML;
  	}, function(html) {
      var allSum = 0;
      var pageSum = 0;
      var $ = cheerio.load(html);
      var numPerPage = $('.s-r-list').length;

      if ($('.pagination').find('a').length) {
        pageSum = $('.pagination').find('a').length;
        halfSum = numPerPage * (pageSum-1);
      } else if ($('.pagination').find('span').length) {
        pageSum = 1;
        halfSum = numPerPage * 1;
      }
      console.log("halfSum = " + halfSum);

      if (pageSum > 1) {
        nightmare.goto(lastUrl + "" + pageSum)
        .wait(3000)
        .evaluate(function () {
          return document.getElementsByTagName('html')[0].innerHTML;
        }, function(html) {
          var $ = cheerio.load(html);
          nextSum = $('.s-r-list').length;
          console.log("nextSum = " + nextSum);
          var sum = Number(halfSum) + Number(nextSum);
          console.log("sum = " + sum);
          var path = __dirname + '/' + "stat.txt";
          console.log(path);
          var buffer = new Buffer(sum + '\n');
          fs.open(path, 'w', function(err, fd) {
            if (err) {
              throw 'error opening file:' + err;
            } else {
              fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writting file: ' + err;
                fs.close(fd, function() {
                  console.log('file wirtten');
                });
              });
            }
          });
        });
      }
    });
  };
};