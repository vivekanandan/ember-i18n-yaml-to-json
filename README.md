# ember-i18n-yaml-to-json

This README outlines the details of collaborating on this Ember addon.

## Installation

* `ember install ember-i18n-yaml-to-json`

* In your Brocfile add the following at the top and before any build related activities.<br/>
  `var yamlToJsonEngine = require('ember-i18n-yaml-to-json').engine;`<br/>
  `yamlToJsonEngine.convert();`<br/>

* `ember build --yaml-path=<YAML_PATH> --js-path=<JS_PATH> --default-locale=en --file-type=js`

* You can even overwrite the parameters during conversion <br/>
   `yamlToJsonEngine.convert({yamlDir:"<YAML_PATH>",jsDir:"<JS_PATH>",defaultLocale:"en",fileType:"js"});`<br/>
   Ignore the params during `ember build`. If you give any, then command-line params will overwrite the params given during function call.

It will help you get rid of the pain in juggling between yml & js for i18n translations. I mean, yml file(as in Ruby on Rails "config/locales") for your backend translations and js file (as in ember-i18n "app/locales/en/translations") for frontend translations. It will enable you to maintain your i18n translations in a centralized location(.yml) by converting all your translation file to js/json format during "ember build". It also has a fallback mechanism with reference to your default locale, any missing key will grab the value from "default-locale"( or en.yml) during conversion.

From 0.1.15 onwards it will generate translations with JSON extension by default. To change it to JS provide the option in command-line as --file-type=js or while calling `convert({fileType:"js"})` method.

PS: this addon currently supports the locale path format as in ember-i18n, i.e., your yml files will be placed at <JS_PATH>/<LOCALE>/translations.js
