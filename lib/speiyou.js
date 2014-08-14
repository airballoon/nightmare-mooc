var exec = require('child_process').exec;
var request = require('superagent');
var cheerio = require('cheerio');
var _ = require('lodash');
var async = require('async');
var city_map = require('./city');
var subject_map = require('./subject');
var grade_map = require('./grade');

//城市列表
var cityList = _.keys(city_map);
//年级数组
var gradeList = _.keys(grade_map);
//课程数组
var subjectList = _.keys(subject_map);

var url_proto =
'.speiyou.com/search/index/grade:0/level:bx/subject:/gtype:time/service:/time:/term:/period:/o:da/bg:n/curpage:';

function insert(connection, values){
  connection.query('INSERT INTO Mooc SET ?', values, function(err, result) {
    if (err) throw err;
    console.log('INSERT A ROW');
  });
}

/**
 * @param connection mysql
 * @param nightmare
 * @param url
 * @curpage current page num
 * @grade
 * @subject
 * @city
 */

function crawler(connection, nightmare, url, city, gradeindex, curpage) {
  nightmare
    .goto(url + "" + curpage)
    .evaluate(function () {
      return document.getElementsByTagName('html')[0].innerHTML;
    }, function(html) {
      var pageSum = 0;
      var $ = cheerio.load(html);
      var mooc = $('.s-r-list');

      if (mooc.length){
        if ($('.pagination').find('a').length) {
          pageSum = $('.pagination').find('a').length;
        } else if ($('.pagination').find('span').length) {
          pageSum = 1;
        }
        mooc.each(function(i, elem) {
          var $e = $(this);
          var subject = $e.find(".s-r-list-info p").first().find("span").first().text();
          subject = subject.substr(subject.length - 2, 2);
          var price = $e.find(".price > span").text();
          var data = {
            'city': city_map[city],
            'city_id': city,
            'subject': subject,
            'grade_id': gradeindex,
            'grade': grade_map[gradeindex],
            "price": price
          };
          //插入到数据库中
          insert(connection, data);
        });

        curpage++;
        if(curpage <= pageSum) {
          console.log(curpage);
          crawler(connection, nightmare, url, city, gradeindex, curpage);
        }
      } else {
        return;
      };
    });
}

/**
 *城市、年级、科目三个维度统计
 */
var fetch = exports.fetch = function(connection) {

  return function(nightmare) {
    //递归年级
    _.each(gradeList, function(grade, gradeindex) {
      //递归城市
      async.eachSeries(cityList, function(city, callback) {
        var url = 'http://' + city + url_proto;
        url = parseURL(url, gradeindex);
        crawler(connection, nightmare, url, city, gradeindex, 1);
        callback();
      }, function(err, result) {
        if (err) {
          console.log('a error happened' + err);
        } else {
          console.log('success');
        }
      });
    });
  };
};


function parseURL(url, grade) {
  var _url = url.replace(/grade:\d/, ('grade:' + grade));
  return _url;
}
