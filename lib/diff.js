var fs = require('fs'),
    imagediff = require('./imagediff.js'),
    Canvas = require('canvas'), 
    mkdirp = require('mkdirp'), 
    path = require('path');

module.exports = function diff(fileA, fileB, diffPath, callback) {
    var fileARawData = fs.readFileSync(fileA),
        fileBRawData = fs.readFileSync(fileB),
        firstImage = new Canvas.Image(), 
        secondImage = new Canvas.Image(),
        tolerance = 0,
        equal,
        result, 
        fileAData, 
        fileBData;
        
        firstImage.src = fileARawData; 
        secondImage.src = fileBRawData;
        fileAData = imagediff.toImageData(firstImage);
        fileBData = imagediff.toImageData(secondImage);
        equal = imagediff.equal(fileAData, fileBData, tolerance);

        if (!equal) {
            result = imagediff.diff(fileAData, fileBData, { align: 'top' });
            mkdirp(path.dirname(diffPath));
            imagediff.imageDataToPNG(result, diffPath);
            callback(false, diffPath);
        } else {
            callback(true);
        }
}