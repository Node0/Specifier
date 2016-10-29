#!/usr/local/bin/node

var fs   = require('fs'),
    path = require('path'),
    shjs = require('shelljs'),
    hash = require('shorthash'),
    sh   = require('child_process').execSync,
    startDirectory = process.argv[2];


// Quickly iterable test path.
var startDirectory = "/Users/ddhljoehacobian/Desktop/specifier_test0";

// Check if there is valid input (a path to a folder), exit if no valid input given.

if (typeof startDirectory !== undefined && fs.statSync(startDirectory).isDirectory()) {
    addShorthashToFilename();
} else {
    console.log("Invalid starting directory, please provide a valid path to a starting directory");
    process.exit();
}

// RegEx sub-strings used to compile match expression for all supported filenames.
function fileExtensions(userExtensions) {


    /* Permanently adding new file extensions and/or new file types
     *
     * Extensions:
     * Additional file extensions and entire classes of file types can be easily added to specifier by
     * either appending the file extension one wishes to add to the apropriate key under the extensionsByFileType
     * object below e.g. In order to add a new image format extension 'pcd' (photocd) to the images key
     * all one needs to do is append it separated by a '|' as follows: 'images':'jpeg|jpg|jp2|png|gif|tga|tif|tiff|bmp|dng|raw|nef|cr2|pcd'
     *
     * Please note: In order to add file extensions with periods in them, the period needs to be escaped as follows: nef\.7z
     *
     * File Types:
     * New file types may also be added easily simply by adding a new key to the object and setting the value
     * of the key to a string of extensions separated by the '|' symbol.
     * As an arbitrary example, to add a 'cache' file type one would
     * create the following key: 'cache':'tmp|tmp2|cch'
     *
     * Please note: The value of the key must be a string and it must never begin or end with the '|' symbol as
     * the keys are joined into a string with the beginning and ending (between keys of course) '|' symbols
     * added automatically.
     */

    var extensionsByFileType = {
            'images':'jpeg|jpg|jp2|png|gif|tga|tif|tiff|bmp|dng|raw|nef|cr2',
            'documents':'html|htm|pdf|doc|odf|rtf|txt|md|xls',
            'archives':'zip|tar|bz2|tar\.gz|tar\.bz|tar\.bz2|rar|7z|bz|bz2|gz',
            'sourcecode':'js|php|sql|cpp|c|go|py|rb|lua|css',
            'data':'json|xml|csv'
        },
        userExt = (typeof userExtensions === 'string') ? userExtensions : '',
        fileExtRegExArr = [];

    // Add all file types to an array where each key is an index of the array.
    Object.keys(extensionsByFileType).forEach( (key) => { fileExtRegExArr.push(extensionsByFileType[key]); });

    // For when fileExtensions() is called WITH a user supplied string i.e. fileExtensions('nef.7z')
    // Guard against spurious file extension regex additions supplied by the user and only allow sane file extension formats.
    // Sane examples would be (1 to 5 characters without a dot or...): tar.zip, foo.bar, and yes foo.7z, or bar.z
    if ( userExt !== '' && Boolean(userExt.match(/\s{1,}/i)) === false ) {
        if( Boolean( userExt.match(/['\";.,!@#$%&*=\-\?]{1,}/i) ) !== false ) {
            if ( Boolean( userExt.match(/(([a-z0-9]{1,5})(\.)?([a-z0-9]{1,5})?)/i) ) === true ) {
                fileExtRegExArr.push(userExt);
            }
        }
    }
    return `\\.(${fileExtRegExArr.join('|')})$`;
}
var fileExtRegEx = new RegExp(fileExtensions(), 'i');



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

function getFilename(filePath) {
    return path.basename(filePath);
}

function getFileBasename(fileFullname) {
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


            //console.log(path.dirname(filePath));

            let pathBaseFolder = path.dirname(filePath);

            // Experiment with using nanoseconds as secondary input to ensure unique hash in situations where
            // one filename has multiple extensions and uniqueness is desired, or where the same filename is
            // programmatically generated over and over.
            //let fileBasenameHash = hash.unique(`${fileBasename}${timeNow('nano')}`);
            let fileBasenameHash = hash.unique(fileBasename);

            //console.log(`File basename string fed to hash algo: ${fileBasename}`);
            //console.log(`Hash generated from file basename: ${fileBasenameHash}`);
            //console.log(`${pathBaseFolder}/${fileBasename}_id-${fileBasenameHash}${fileExt}`);

            // Debuging printouts...
            //console.log(pathBasename);
            //console.log(fileBasename.replace(fileExtRegEx, ""));
        }
    });



}

module.exports = {
    "getFilename": getFilename,
    "getFileBasename": getFileBasename
}

