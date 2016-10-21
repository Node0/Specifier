#!/usr/local/bin/node

var fs   = require('fs'),
    path = require('path'),
    shjs = require('shelljs'),
    hash = require('shorthash'),
    sh   = require('child_process').execSync,
    startDirectory = process.argv[2];

// Check if there is valid input (a path to a folder), exit if no valid input given.

if (typeof startDirectory !== undefined && fs.statSync(startDirectory).isDirectory()) {
addShorthashToFilename();
} else {
console.log("Invalid starting directory, please provide a valid path to a starting directory");
process.exit();
}

// RegEx sub-strings used to compile match expression for all supported filenames.
var imageTypes = 'jpeg|jpg|png|gif|tif|tiff|bmp|dng|raw',
    docTypes = 'html|htm|pdf|doc|odf|rtf|txt|md|xls',
    archiveTypes = 'zip|tar|bz2|tar\.gz|tar\.bz|tar\.bz2|rar|7z|bz|gz',
    codeTypes = 'js|php|sql|cpp|c|go|py|rb|lua|css|xml|json';

var fileExtRegExString = `\\.(${imageTypes}|${docTypes}|${archiveTypes}|${codeTypes})$`,
    fileExtRegEx = new RegExp(fileExtRegExString, "i");

function timeNow(unit) {
    let hrTime=process.hrtime()
    switch (unit) {
        case 'milli':return hrTime[0] * 1000 + hrTime[1] / 1000000;
        case 'micro':return hrTime[0] * 1000000 + hrTime[1] / 1000;
        case 'nano':return hrTime[0] * 1000000000 + hrTime[1];
        break;
        default:return hrTime[0] * 1000000000 + hrTime[1];
    }
}

function getFilename (filePath) {
        return path.basename(filePath);
}

function getFileBasename (fileFullname) {
    if ( fileFullname.includes('Screen Shot') ) {
        var fileBasename = fileFullname.substring(0, fileFullname.lastIndexOf('.') );
    } else { 
        var fileBasename = fileFullname.substring(0, fileFullname.indexOf('.') );
    }
    return fileBasename;
}




function addShorthashToFilename() {
    shjs.find(startDirectory).toString().split(',').forEach(function (filePath) {

        if (fs.statSync(filePath).isFile()) {
            let fileFullname = getFilename(filePath);
            let fileExt = (fileFullname.match(fileExtRegEx) !== null ) ? filePath.match(fileExtRegEx)[0] : '';
            //let fileBasename = fileFullname.replace(fileExtRegEx, "");
            let fileBasename = getFileBasename(fileFullname);
            let pathBasename = filePath.replace(fileExtRegEx, "");
            
            // Here we have three capture groups, we start from the beginning of the line
            // and match 1 or more of anything up until the last forward slash before the filename.
            // Since all regexp match results are array indexed by capture group we grab the first
            // part of the string e.g. the base folder.
            
            //console.log(filePath);
            //console.log(path.dirname(filePath));
            
            let pathBaseFolder = path.dirname(filePath);

            // Experiment with using nanoseconds as secondary input to ensure unique hash in situations where
            // one filename has multiple extensions and uniqueness is desired, or where the same filename is
            // programmatically generated over and over.
            //let fileBasenameHash = hash.unique(`${fileBasename}${timeNow('nano')}`);
            let fileBasenameHash = hash.unique(fileBasename);

            console.log(`File basename string fed to hash algo: ${fileBasename}`);
            console.log(`Hash generated from file basename: ${fileBasenameHash}`);
            console.log(`${pathBaseFolder}/${fileBasename}_id-${fileBasenameHash}${fileExt}`);

            // Debuging printouts...
            console.log(pathBasename);
            //console.log(fileBasename.replace(fileExtRegEx, ""));
        }
    });


    /*if (fs.statSync(filePath).isFile()) {
        let fileFullname = filePath.match(/(^.+)(\/)([a-zA-Z\-_\.]{1,64}$)/)[3];
        let fileExt = (filePath.match(fileExtRegEx) !== null ) ? filePath.match(fileExtRegEx)[0] : '';
        let fileBasename = fileFullname.replace(fileExtRegEx, "");
        let pathBasename = filePath.replace(fileExtRegEx, "");
        let pathBaseFolder = filePath.match(/(^.+)(\/)([a-zA-Z\-_\.]{1,64}$)/)[1];

        // Experiment with using nanoseconds as secondary input to ensure unique hash in situations where
        // one filename has multiple extensions and uniqueness is desired, or where the same filename is
        // programmatically generated over and over.
        //let fileBasenameHash = hash.unique(`${fileBasename}${timeNow('nano')}`);
        let fileBasenameHash = hash.unique(fileBasename);

        console.log(`File basename string fed to hash algo: ${fileBasename}`);
        console.log(`Hash generated from file basename: ${fileBasenameHash}`);
        console.log(`${pathBaseFolder}/${fileBasename}_id-${fileBasenameHash}${fileExt}`);

        // Debuging printouts...
        console.log(pathBasename);
        //console.log(fileBasename.replace(fileExtRegEx, ""));
    }*/
}

module.exports = {
    "getFilename": getFilename,
    "getFileBasename": getFileBasename
}
