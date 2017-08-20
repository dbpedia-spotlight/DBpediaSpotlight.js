/**
 * MDBSpotlight -> Multilingual DBpedia Spotlight
 * Detects the language of a given piece of text and Sends it to the corresponding DBpedia Spotlight instance.
 *
 * @author Ali Khalili- @ali1k
 * @author http://www.ali1k.com
 *
 * @see https://github.com/
 *
 * Installation:
 *  npm install MDBSpotlight
 **/
var lngDetector = new (require('languagedetect'));
var request = require('superagent');
var url = require('url');
//user define endpoints
var user_defined_endpoints={};
var is_fixed_endpoint=0;
var fixed_endpoint='';
//stores list of user defined endpoints
exports.configEndpoints= function(endpoints){
  user_defined_endpoints=endpoints;
};
//considers one endpoint for all the requests,thereby deactivates language detection
exports.fixToEndpoint= function(endpoint_name){
  is_fixed_endpoint=1;
  fixed_endpoint=endpoint_name;
};

exports.unfixEndpoint = function() {
  is_fixed_endpoint = 0;
};

// Annotating the text
exports.annotate=function(input, cb, err) {
    // Default endpoints for Spotlight
    var default_endpoints = {
      english    : { host: 'model.dbpedia-spotlight.org', path: '/en/annotate', port: '80', confidence: 0  , support: 0 },
      german     : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2226', confidence: 0.5, support: 0 },
      dutch      : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2232', confidence: 0.5, support: 0 },
      hungarian  : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2229', confidence: 0.5, support: 0 },
      french     : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2225', confidence: 0.5, support: 0 },
      portuguese : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2228', confidence: 0.5, support: 0 },
      italian    : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2230', confidence: 0.5, support: 0 },
      rusian     : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2227', confidence: 0.5, support: 0 },
      turkish    : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2235', confidence: 0.5, support: 0 },
      spanish    : { host: 'spotlight.sztaki.hu', path: '/rest/annotate', port: '2231', confidence: 0.5, support: 0 }
    };

    if (is_fixed_endpoint) {
      // No need to detect the langauage or check user-defined endpoints
      lang_arr = fixed_endpoint;
    } else {
      //detect the language
     // fix if lngdetector returns empty array
      lang_arr = "english";
      var detectionResult = lngDetector.detect(input, 1);
      if (detectionResult[0] && detectionResult[0][0])
        lang_arr= detectionResult[0][0].toLowerCase();
    }
    // First check user_defined_endpoints
    if (user_defined_endpoints[lang_arr]) {
      spotlight_config = user_defined_endpoints[lang_arr];
    } else {
      if (default_endpoints[lang_arr]) {
        spotlight_config = default_endpoints[lang_arr];
      } else {
        // If no default endpoint is defiend, use the English endpoint
        if (user_defined_endpoints.english) {
          spotlight_config = user_defined_endpoints.english;
        } else {
          spotlight_config = default_endpoints.english;
        }
      }
    }
    var endpoint = url.format({
        protocol: spotlight_config.protocol || 'http:',
        slashes: '//',
        auth:     spotlight_config.auth,
        hostname: spotlight_config.host,
        port:     spotlight_config.port,
        pathname: spotlight_config.path || '/rest/annotate',
    });

    request.post(endpoint)
        .accept('application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
        .send({
            'text':       input,
            'confidence': spotlight_config.confidence,
            'support':    spotlight_config.support
        })
        .end(function(err, res) {
            debugger;
            var output = {
                'language': lang_arr,
                'endpoint': endpoint,
                'error':    err,
                'response': res.body
            };
            cb(output);
        });
};
