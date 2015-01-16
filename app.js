var Nightmare = require('nightmare'),
    config = require('./config'), 
    Canvas = require('canvas'),
    diff = require('./lib/diff'),
    colors = require('colors/safe'),
    fs = require('fs'),
    rootUrls = config.rootUrls,
    pages = config.pages,
    logfile = config.logfile,
    protocol = config.protocol, 
    screenshotFolderName = config.screenshotFolderName, 
    snap_count = 0;


rootUrls.forEach(loopPages);

function loopPages(url) {
  pages.forEach(function(page){
    snap(page, url);
  });
};

function snap(page, url) {
  var nightmare = new Nightmare(),
      fullUrl = protocol + '://' + url + page, 
      filePath = getFilePath(url, page);

  nightmare
    .viewport(config.viewport.width, config.viewport.height)
    .useragent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36')
    .on('error', function(){
      fs.appendFile(logfile, JSON.stringify(arguments));
    })
    .goto(fullUrl)
    .wait()
    .screenshot(filePath)
    .run(function(err, nightmare){
      if(err) {
        console.log(err);
      } else {
        console.log('Completed taking screenshot ' + filePath)
      }
      complete();
    });

    snap_count++;
}

function compareScreenshots() {
  pages.forEach(function(page){

    var urlOne = getFilePath(rootUrls[0], page),
        urlTwo = getFilePath(rootUrls[1], page), 
        diffPath = getFilePath('diff/', page);
    
    console.log('Comparing ' + urlOne + ' to ' + urlTwo);
    console.log('');
    
    diff(urlOne, urlTwo, diffPath, function(success, diff){
      if (success) {
        console.log('Equal ' + urlOne + ' and ' + urlTwo);
      } else {
        console.log('Not equal ' + urlOne + ' and ' + urlTwo);
        console.log("Diff image has been created " + diff);
        console.log('');
      }
    });

  });
}

function complete() {
  snap_count--;
  if (snap_count == 0) {
    console.log('');
    console.log('Completed all screenshots');
    compareScreenshots()
  }
}

function getFilePath(url, page) {
  var page_without_trailing_slash = page.replace(/\/$/, "");
  return screenshotFolderName + '/' + url + page_without_trailing_slash + '.png';
}
console.log(colors.green('Starting.....'));


