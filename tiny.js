'use strict'
const tinify = require('tinify');
const fs = require('fs');
const async = require('async');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

tinify.key = "set api key";



var pathDir = {
    unoptimized:'not_optimize_image',
    optimize:'optimize'
}

var dirs = fs.readdirSync('./');
for (var i in pathDir){
    if(!arrayHasValue(dirs, pathDir[i])){
        fs.mkdirSync(pathDir[i]);
    }
}

if(fs.readdirSync('./'+pathDir.unoptimized+'/').length==0){
    console.log(pathDir.unoptimized + ' пустая');
    process.exit();
}

function arrayHasValue(arr, value) {
    for (var i=0; i<arr.length; i++){
        if (arr[i] === value)
        return true;
    }
    return false;
}

function optimize(file){
    const source = tinify.fromFile(file);
    var path = file.replace(pathDir.unoptimized,pathDir.optimize);
    source.toFile(path);
}

function createDir(name){
    var path = name.replace(pathDir.unoptimized, pathDir.optimize);
    fs.mkdirSync(path);
}

var getFiles = function (dir, files_){ 
  files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            createDir(name);
            getFiles(name, files_);
        } else {
            files_.push(name);
            optimize(name);
        }
    }
};

rimraf('./'+pathDir.optimize+'/*', function () { 
    getFiles('./'+pathDir.unoptimized);
});