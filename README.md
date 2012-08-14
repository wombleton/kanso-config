# Kanso Config

This package allows you to easily include the values of configuration
documents into a kanso application.

## Install

Add to your project's kanso.json dependencies setting, here is the minimal
case:

```json
"dependencies": {
    "kanso-config": null
}
```

Run kanso install to install in your packages directory:

```
kanso install
```

## Configure

This is the default configuration:
```
"kanso-config": {
  "dataKey": "kanso-config",
  "listId": "config",
  "viewId": "config.js",
  "type": "config",
  "module": "module",
  "path": "config.js"
}
```

Include the generated config file into your HTML page:

```
 <script src="{baseURL}/config.js" type="text/javascript"></script>
```

This will read a document with a `type` of `config` and a value in the `module` field.
(Change these by updating `type` or `module` in the config).

Note: There needs to be `lists` and `rewrites` defined for the module to work correctly (they can be empty).

You can then retrieve the configuration in the following way:
```
  var config = $.kansoconfig();
```

You can get particular keys:
```
  var value = $.kansoconfig('key'); // returns 'value'
  var miss = $.kansoconfig('miss'); // returns the key back, 'miss'
  var sansFallback = $.kansoconfig('miss', true); // returns undefined
```
