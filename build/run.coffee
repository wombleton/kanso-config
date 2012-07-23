showFn = (doc, req) ->
  return {
    body: """
      (function($) {
        var config = {},
            i,
            value,
            values;
        values = #{JSON.stringify(doc.values)} || [];
        for (i = 0; i < values.length; i++) {
          value = values[i];
          config[value.key] = value.value;
        }

        $(document).data('kanso-config', config);
      })(jQuery);
    """
    headers:
      'Content-Type': 'text/javascript'
  }

module.exports =
  run: (root, path, settings, doc, callback) ->
    { lib } = doc

    config = settings['kanso-config'] or {}
    config.showId = config.showId or 'config'
    config.configDocId = config.configDocId or 'config.js'

    lib?.shows += """
      exports['#{config.showId}'] = #{showFn.toString()}
    """
    callback(null, doc)
