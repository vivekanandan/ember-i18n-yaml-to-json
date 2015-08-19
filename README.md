# ember-i18n-yaml-to-json

This README outlines the details of collaborating on this Ember addon.

## Installation

* `ember install ember-i18n-yaml-to-json`

* In your Brocfile add the following at the top and before any build related activities.
   var yamlToJsonEngine = require('ember-i18n-yaml-to-json').engine;
   yamlToJsonEngine.convert();

* `ember build --yaml-path="<YAML_PATH" --js-path="<JS_PATH>"`


This addon may help those who juggle between yml & js for i18n translations. If you are using yml file(as in Ruby on Rails "config/locales") for your backend translations and js file (as in ember-i18n "app/locales/en/translations") for frontend translations. It will enable you to maintain your i18n translations in a centralized location(.yml) by converting all your translation file to js format during "ember build". It also has a fallback mechanism with en.yml as reference doc, any missing key will grab the value from en.yml during conversion.

PS: this addon currently supports the locale path format as in ember-i18n, i.e., your yml files will be placed at <JS_PATH>/<locale>/translations.js