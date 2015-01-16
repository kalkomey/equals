var fs = require('fs'),
    imagediff = require('./lib/imagediff'),
    Canvas = require('canvas'), 
    mkdirp = require('mkdirp'), 
    path = require('path');

/**
* Function diff - compares two files, if files are not equal, a diff image is created
* the image will be saved at specified diffPath (if directory in path does not exist, it is created recursively)
* fileA - first file
* fileB - second file to compare
* diffPath - full path where the diff file should be saved e.g diff_folder/diff.png
*/
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
            if (typeof diffPath === undefined) {
                throw 'diff path must be specified unable to save diff of ' + fileA + ' and ' + fileB;
            }
            result = imagediff.diff(fileAData, fileBData, tolerance);
            mkdirp(path.dirname(diffPath));
            imagediff.imageDataToPNG(result, diffPath);
            callback(false, diffPath);
        } else {
            callback(true);
        }
}