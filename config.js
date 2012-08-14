module.exports = {
  after: [ 'modules' ],
  run: function(root, path, settings, doc, callback) {
    var config, data, key, lib, listBody, rewriteBody, showId, viewBody, viewId;
    config = settings['kanso-config'] || {};
    listId = config.listId || 'config';
    viewId = config.viewId || 'config';
    data = config.dataKey || 'kanso-config';
    path = config.path || 'config.js';
    type = config.type || 'config';
    module = config.module;

    if (!module) {
      return callback("A unique module is required.", null);
    }

    if (doc.lib) {
      lib = doc.lib;

      viewBody = "{\n" +
        "    map: function(doc) {\n" +
        "      if (doc.type === '" + type + "' && doc.module) {\n" +
        "        emit(doc.module, doc);\n" +
        "      }\n" +
        "    }\n" +
        "  }\n";
      if (lib.views) {
        lib.views += "\n" +
          "(function() {\n" +
          "  module.exports['" + viewId + "'] = " + viewBody +
          "}).call(this);";
      } else {
        doc.views = {};
        doc.views[viewId] = viewBody;
      }

      listBody = " function() {\n" +
        "    provides('js', function() {\n" +
        "      var names, values, value, js;\n" +
        "      values = {};\n" +
        "      while (row = getRow()) {\n" +
        "        values[row.key] = {};\n" +
        "        config = row.value || {};\n" +
        "        properties = Object.keys(config);\n" +
        "        properties.forEach(function(name) {\n" +
        "          if (!(/^" + type + "|" + module + "/.test(name))) {\n" +
        "            values[row.key][name] = config[name];\n" +
        "          }\n" +
        "        });\n" +
        "      }\n" +
        "      js = \"(function($) {\\n\" +\n" +
        "      \"  var config;\\n\" +\n" +
        "      \"  config = \" + JSON.stringify(values) + \";\\n\" +\n" +
        "      \"  $(document).data('" + data + "', config);\\n\" +\n" +
        "      \"  $.kansoconfig = function(key, context, noFallback) {\\n\" +\n" +
        "      \"    var result;\\n\" +\n" +
        "      \"    if (arguments.length === 2 && !!context === context) {\\n\" +\n" +
        "      \"      noFallback = context;\\n\" +\n" +
        "      \"      context = undefined;\\n\" +\n" +
        "      \"    }\\n\" +\n" +
        "      \"    if (context !== undefined) {\\n\" +\n" +
        "      \"      result = config[context][key];\\n\" +\n" +
        "      \"    } else {\\n\" +\n" +
        "      \"      result = Object.keys(config).reduce(function(memo, context) {\\n\" +\n" +
        "      \"        return memo || config[context][key];\\n\" +\n" +
        "      \"      }, undefined);\\n\" +\n" +
        "      \"    };\\n\" +\n" +
        "      \"    if (arguments.length === 0) {\\n\" +\n" +
        "      \"      return config;\\n\" +\n" +
        "      \"    } else if (noFallback) {\\n\" +\n" +
        "      \"     return (result && result.value) || result;\\n\" +\n" +
        "      \"    } else {\\n\" +\n" +
        "      \"      return (result && result.value) || result || key;\\n\" +\n" +
        "      \"    }\\n\" +\n" +
        "      \"  };\\n\" + \n" +
        "      \"})(jQuery)\"\n" +
        "      return js;\n" +
        "    });\n" +
        "  }";
      if (lib.lists) {
        lib.lists += "(function() { module.exports['" + listId + "'] = " + listBody + "}).call(this);\n";
      } else {
        doc.lists = {};
        doc.lists[listId] = listBody;
      }

      rewriteBody = "{\n" +
        "  from: '/" + path + "',\n" +
        "  to: '_list/" + listId + "/" + viewId + "'\n" +
      "}\n";
      if (lib.rewrites) {
        lib.rewrites += "(function() { module.exports.unshift(" + rewriteBody + ") }).call(this);";
      } else {
        doc.rewrites =  [
          {
            from: '/' + path,
            to: '_list/' + listId + '/' + viewId
          }
        ];
      }
    }
    return callback(null, doc);
  }
};
