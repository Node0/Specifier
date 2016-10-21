const specifier = require('./specifier.js');


const chai = require('chai'),
      expect = require('chai').expect;



// Test set for Method: getFileName()
describe('getFilename', () => {
    
    // Testing expected use case.
    it('Should return the basename for a typical file, such as pano_00000001_01.jpg', () => {
    var testGetFilename = specifier.getFilename('/Users/username/Desktop/project/day1/pano_00000001_01.jpg'); 
    expect(testGetFilename).to.equal('pano_00000001_01.jpg');
    });
    
    // Testing compressed archive use case e.g. '.tar.gz'
    it('Should return the basename for an archive file such as pano_00000001_01.tar.gz', () => {
    var testGetFilename = specifier.getFilename('/Users/username/Desktop/project/day1/pano_00000001_01.tar.gz'); 
    expect(testGetFilename).to.equal('pano_00000001_01.tar.gz');
    });

})

describe('getFileBasename', () => {

    // Testing file basename extraction
    it('Should return the basename for an archive file such as Screen Shot 2016-05-10 at 3.31.49 AM.png', () => {
    var testGetFileBasename = specifier.getFileBasename('/Users/username/Desktop/project/day1/Screen Shot 2016-05-10 at 3.31.49 AM.png'); 
    expect(testGetFileBasename).to.equal('/Users/username/Desktop/project/day1/Screen Shot 2016-05-10 at 3.31.49 AM');
    });
    
    // Testing file basename extraction for .tar.gz case
    it('Should return the basename for an archive file such as Screen Shot 2016-05-10 at 3.31.49 AM.tar.gz', () => {
    var testGetFileBasename = specifier.getFileBasename('/Users/username/Desktop/project/day1/Pano_00001_23.tar.gz'); 
    expect(testGetFileBasename).to.equal('/Users/username/Desktop/project/day1/Pano_00001_23');
    });



})
