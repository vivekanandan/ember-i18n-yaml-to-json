/* jshint node: true */
'use strict';

/**
  * converts yaml file to js file
  * params:
  *   --yaml-path=<YAML DIRECTORY LOCATION>
  *   --js-path=<JS DIRECTORY LOCATION>
  *   --default-locale= < DEFAULT LOCALE >
  *   --file-type=< JS/JSON SUPPORTED >
  *   --format= < STRING WITH {{translations}} placeholder >
  **/
var yaml = require('js-yaml');
var fs = require('fs');
var merge = require('deepmerge');
var YAMLToJSON ={
  fileType: "js",
  format: "export default {{translations}} ;",
  convert: function(){
    var pathChecker = require('path');
    var path = this.parsePath(arguments[0]);
    var yamlDir = path.yaml;
    var jsDir = path.js;
    var defaultLocale = path.locale;
    var files = fs.readdirSync(yamlDir);
    files = files.filter(function(fileName){ return fileName.match(/^[A-Za-z\-0-9]{2,10}\.yml/); });
    if(!fs.existsSync(jsDir)){
      fs.mkdirSync(jsDir);
    }
    this.extractRefDoc(yamlDir,jsDir,defaultLocale);
    for(var i=0;i<files.length;i++){
      var yamlFileURL = yamlDir+"/"+files[i];
      if(pathChecker.extname(files[i])!=".yml" || files[i]==(defaultLocale+".yml")){continue;}
      var locale = files[i].split(".")[0];
      this.comparableDoc = merge(this.refDoc,this.toJSON(yamlFileURL,locale));
      this.writeToJS(jsDir,locale,this.comparableDoc);
    }
    console.log("\nYaml files from '"+pathChecker.resolve(yamlDir)+"' has been converted to js in '"+pathChecker.resolve(jsDir)+"'");
  },
  refDoc:null,
  comparableDoc:null,
  extractRefDoc:function(refDir,jsDir,defaultLocale){
    var refURL = refDir+"/"+defaultLocale+".yml";
    this.refDoc = this.toJSON(refURL,defaultLocale);
    this.writeToJS(jsDir,defaultLocale,this.refDoc);
  },
  convertInterpolations:function(text){
    return text.replace(/%(\{\w+\})/g, '{$1}');
  },
  writeToJS:function(jsDir,locale,content){
    var localeDir = jsDir+"/"+locale;
    if(!fs.existsSync(localeDir)){
      fs.mkdirSync(localeDir);
    }
    var jsFileURL = localeDir+"/translations."+this.fileType;
    content = this.convertInterpolations(JSON.stringify(content));
    if(this.fileType=="js"){
        content = this.format.replace("{{translations}}",content);
    }
    fs.writeFileSync(jsFileURL, content);
  },
  toJSON:function(yamlFileURL,locale){
    var file = fs.readFileSync(yamlFileURL,'utf8');
    var doc = yaml.safeLoad(file);
    //support for root element not resembling dialect as in locale string
    doc = doc[locale] || doc[locale.split('-')[0]];
    return doc;
  },
  keyChain:[],
  parsePath: function(){
    var config = require('ember-i18n-yaml-to-json/config/environment')();
    var params = arguments[0] || {};
    var path = {
        yaml: (params.yamlDir || config.i18n.yamlDir),
        js: (params.jsDir || config.i18n.jsDir),
        locale: (params.defaultLocale || config.i18n.defaultLocale)
      };
    var JS_PATH_TOKEN = "--js-path=";
    var YAML_PATH_TOKEN = "--yaml-path=";
    var DEFAULT_LOCALE_TOKEN = "--default-locale=";
    var FILE_TYPE_TOKEN = "--file-type=";
    var FORMAT_TOKEN = "--format=";
    for(var i=0;i<process.argv.length;i++){
      if(process.argv[i].indexOf(JS_PATH_TOKEN)!=-1){
        path["js"] = process.argv[i].split(JS_PATH_TOKEN)[1];
      }
      else if(process.argv[i].indexOf(YAML_PATH_TOKEN)!=-1){
        path["yaml"] = process.argv[i].split(YAML_PATH_TOKEN)[1];
      }
      else if(process.argv[i].indexOf(DEFAULT_LOCALE_TOKEN)!=-1){
        path["locale"] = process.argv[i].split(DEFAULT_LOCALE_TOKEN)[1];
      }
      else if(process.argv[i].indexOf(FILE_TYPE_TOKEN)!=-1){
        this.fileType = process.argv[i].split(FILE_TYPE_TOKEN)[1];
      }
      else if(process.argv[i].indexOf(FORMAT_TOKEN)!=-1){
        this.format = process.argv[i].split(FORMAT_TOKEN)[1];
      }
    }
    if(params.fileType){this.fileType=params.fileType;}
    if(params.format){this.format=params.format;}
    return path;
  }
}

module.exports = {
  name:"ember-i18n-yaml-to-json",
  engine:YAMLToJSON
};
