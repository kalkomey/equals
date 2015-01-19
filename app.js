var Nightmare = require('nightmare'),
    config = require('./config'), 
    Canvas = require('canvas'),
    diff = require('./lib/diff'),
    fs = require('fs'),
    rootUrls = config.rootUrls,
    pages = config.pages,
    logfile = config.logfile,
    protocol = config.protocol, 
    screenshotFolder = config.screenshotFolder, 
    snapCount = 0;


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
    .on('consoleMessage', function(msg) {
      fs.appendFile(logfile, msg);
    })
    .goto(fullUrl)
    .wait()
    .evaluate(function(){
      //Remove chat window before comparing (qa spaces don't have the olark chat window prod does)
      //Hardcoding remove of the chat window for now, it would be nice to get this in 
      //the config file to remove any elements specified.
        
      var chatWindow = document.querySelector('#habla_topbar_div'), 
          parentNode = chatWindow.parentNode;

      parentNode.removeChild(chatWindow);
      return true;
    })
    .screenshot(filePath)
    .run(function(err, nightmare){
      if(err) {
        console.log(err);
      } else {
        console.log('Took screenshot and saved it in --> ' + filePath)
      }
      complete();
    });

    snapCount++;
}

function complete() {
  snapCount--;
  if (snapCount == 0) {
    console.log('Completed all screenshots \n');
    compareScreenshots()
  }
}

function compareScreenshots() {
  pages.forEach(function(page){

    var urlOne = getFilePath(rootUrls[0], page),
        urlTwo = getFilePath(rootUrls[1], page), 
        diffPath = getFilePath('diff/', page);
    
    console.log('Comparing image ' + urlOne + ' to ' + urlTwo);
    
    diff(urlOne, urlTwo, diffPath, function(success, diff){
      if (success) {
        console.log('Images are the same');
      } else {
        console.log('Images are different');
        console.log("Diff image has been created " + diff + '\n');
      }
    });

  });
}

function getFilePath(url, page) {
  var page_without_trailing_slash = page.replace(/\/$/, "");
  return screenshotFolder + '/' + url + page_without_trailing_slash + '.png';
}
console.log('Starting.....\n');