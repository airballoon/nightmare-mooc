var page = require('webpage').create();

page.open('http://sogou.com', function(status) {
  if (status !== 'success') {
    console.log('Unable to access network');
  } else {
    var html = page.evaluate(function() {
      return document.getElementById("n").innerHTML;
    });
    console.log(html);
  }
  phantom.exit();
});