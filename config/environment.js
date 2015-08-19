'use strict';

module.exports = function(/* environment, appConfig */) {
  return { 
	    //i18n yaml & js location path reference should be from frontend dir
	    i18n:{
	      yamlDir:"../config/locales/", //source
	      jsDir: "./app/locales/" //destination
	    }
  };
};
