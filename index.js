/* jshint node: true */
'use strict';

/**
  * converts yaml file to js file
  * params: 
  *   --yaml-path=<YAML DIRECTORY LOCATION>
  *   --js-path=<JS DIRECTORY LOCATION>
  * if no params given, it will take the default path as.
  *     --yaml-path="../config/locales/"
  *   --js-path="./app/locales/"
  **/
var yaml = require('js-yaml');
var fs = require('fs');
var YAMLToJSON ={
  convert: function(){
    var pathChecker = require('path');
    var path = this.parsePath();
    var yamlDir = path.yaml;
    var jsDir = path.js;
    var defaultLocale = path.locale;
    var files = fs.readdirSync(yamlDir);
    if(!fs.existsSync(jsDir)){
      fs.mkdirSync(jsDir);
    }
    this.extractRefDoc(yamlDir,jsDir,defaultLocale);
    for(var i=0;i<files.length;i++){
      var yamlFileURL = yamlDir+"/"+files[i];
      if(pathChecker.extname(files[i])!=".yml" || files[i]==(defaultLocale+".yml")){continue;}
      var locale = files[i].split(".")[0];
      this.comparableDoc = this.toJSON(yamlFileURL,defaultLocale);
      this.doctorMissingElements(this.refDoc);
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
  writeToJS:function(jsDir,locale,content){
    var localeDir = jsDir+"/"+locale;
    if(!fs.existsSync(localeDir)){
      fs.mkdirSync(localeDir);
    }
    var jsFileURL = localeDir+"/translations.js";    
    content = "export default "+JSON.stringify(content)+";";
    fs.writeFileSync(jsFileURL, content);
  },
  toJSON:function(yamlFileURL,locale){
    var file = fs.readFileSync(yamlFileURL,'utf8');
    var doc = yaml.safeLoad(file);
    return doc[locale];
  },
  keyChain:[],
  doctorMissingElements:function(doc){
    for(var key in doc){        
      this.keyChain.push(key);
      var actual = eval("this.refDoc."+this.keyChain.join("."));
      var comparable = eval("this.comparableDoc."+this.keyChain.join("."));
      var actualType = typeof actual;
      var comparableType = typeof comparable;
      if((actual instanceof Object) && (comparable!=undefined && (actualType==comparableType))){
        this.doctorMissingElements(doc[key]);
      }
      else{
        var actualKey = this.keyChain.join(".");
        if(comparable ==undefined || (actualType != comparableType)){
          eval("this.comparableDoc."+actualKey+"=this.refDoc."+actualKey);
        }
      }        
      this.keyChain.pop();
    }      
  },
  parsePath: function(){
    var config = require('ember-i18n-yaml-to-json/config/environment')();
    var path = {
        yaml: config.i18n.yamlDir,
        js: config.i18n.jsDir,
	   locale: config.i18n.defaultLocale
      };
    var JS_PATH_TOKEN = "--js-path=";
    var YAML_PATH_TOKEN = "--yaml-path=";
    var DEFAULT_LOCALE_TOKEN = "--default-locale=";
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
    }
    return path;
  }
}

module.exports = {
	name:"ember-i18n-yaml-to-json",
	engine:YAMLToJSON
};