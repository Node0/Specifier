#!/usr/local/bin/node

var fs   = require('fs'),
    path = require('path'),
    shjs = require('shelljs'),
    hash = require('shorthash');

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


if (typeof process.argv[2] !== undefined && fs.statSync(process.argv[2]).isDirectory()) {

    shjs.find(process.argv[2]).toString().split(',').forEach(function (filePath) {
        
    if (fs.statSync(filePath).isFile()) {
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
        //console.log(pathBasename);
        //console.log(fileBasename.replace(fileExtRegEx, ""));
    }
    
});

} else {
    console.log("Please specify a base directory to begin from.")
}
