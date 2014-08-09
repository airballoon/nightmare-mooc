var exec = require('child_process').exec;
var request = require('superagent');
var cheerio = require('cheerio');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var csv = require('csv');
var cityJSON = require('./city');

var cityList = _.keys(cityJSON);

var firstUrl_list = _.map(cityList, function(code, index) {
  return 'http://' + code + '.speiyou.com/search/index/subject:/grade:0/gtype:time';
});

var lastUrl_list = _.map(cityList, function(code, index) {
  return 'http://' + code + '.speiyou.com/search/index/grade:0/level:bx/subject:/gtype:time/service:/time:/term:/period:/o:da/bg:n/curpage:';
});


function crawler(nightmare, url, index) {

  nightmare
    .goto(url)
    .evaluate(function () {
      return document.getElementsByTagName('html')[0].innerHTML;
    }, function(html) {
      var halfSum = 0;
      var nextSum = 0;
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
      console.log(cityJSON[cityList[index]] + "pageSum = " + pageSum + " &  halfSum = " + halfSum);

      if (pageSum > 1) {
        nightmare.goto(lastUrl_list[index] + "" + pageSum)
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
          var buffer = new Buffer(cityJSON[cityList[index]] + sum + '\n');
          fs.appendFile(path, buffer, function(err) {
            if (err) throw 'error writting file: ' + err;
            console.log('file wirtten' + index);
          });
          csv()
          .from(sum)
          .to(function(data) {

          });
        });
      } else {
        var sum = Number(halfSum) + Number(nextSum);
        console.log("sum = " + sum);
        var path = __dirname + '/' + "stat.txt";
        var buffer = new Buffer(cityJSON[cityList[index]] + sum + '\n');
        fs.appendFile(path, buffer, function(err) {
          if (err) throw 'error writting file: ' + err;
          console.log('file wirtten' + index);
        });
      }
    });
}


var fetch = exports.fetch = function() {
  return function(nightmare) {
    var index = 0;
    async.eachSeries(firstUrl_list, function(url, callback) {
      crawler(nightmare, url, index++);
      callback();
    }, function(err, result) {
      if (err) {
        console.log('a error happened' + err);
      } else {
        console.log('success');
      }
    });
  };
};
