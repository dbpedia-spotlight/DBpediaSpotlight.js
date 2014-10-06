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
 *
**/
var lngDetector = new (require('languagedetect'));
var http = require('http');
var querystring = require('querystring');
//user define endpoints
var user_defined_endpoints={};
var is_fixed_endpoint=0;
var fixed_endpoint='';
//stores list of user defined endpoints
exports.configEndpoints= function(endpoints){
  user_defined_endpoints=endpoints;
}
//considers one endpoint for all the requests,thereby deactivates language detection
exports.fixToEndpoint= function(endpoint_name){
  is_fixed_endpoint=1;
  fixed_endpoint=endpoint_name;
}
exports.unfixEndpoint= function(){
  is_fixed_endpoint=0;
}
//annotating the text
exports.annotate=function(input, cb, err) {
    //default endpoints for Spotlight
    var default_endpoints={
      "english"    : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2222',confidence:0  ,support:0},
      "german"     : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2226',confidence:0.5,support:0},
      "dutch"      : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2232',confidence:0.5,support:0},
      "hungarian"  : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2229',confidence:0.5,support:0},
      "french"     : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2225',confidence:0.5,support:0},
      "portuguese" : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2228',confidence:0.5,support:0},
      "italian"    : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2230',confidence:0.5,support:0},
      "rusian"     : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2227',confidence:0.5,support:0},
      "turkish"    : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2235',confidence:0.5,support:0},
      "spanish"    : {host:'spotlight.sztaki.hu', path:'/rest/annotate', port:'2231',confidence:0.5,support:0}
    }
    if(is_fixed_endpoint){
      //no need to detect the langauage or check user-defined endpoints
      lang_arr=fixed_endpoint;
    }else{
      //detect the language
      lang_arr=lngDetector.detect(input, 1)[0][0].toLowerCase()
    }
    //first check user_defined_endpoints
    if(user_defined_endpoints[lang_arr]){
      spotlight_config=user_defined_endpoints[lang_arr];
    }else{
      if(default_endpoints[lang_arr]){
        spotlight_config=default_endpoints[lang_arr];
      }else{
        //if no default endpoint is defiend, use the English endpoint
        if(user_defined_endpoints["english"]){
          spotlight_config=user_defined_endpoints["english"];
        }else{
          spotlight_config=default_endpoints["english"];
        }

      }
    }
    // Build the post string from an object
    var post_data = querystring.stringify({
        'text' : input,
        'confidence': spotlight_config.confidence,
        'support' : spotlight_config.support
    });
    var err=0;
    var options={
        host: spotlight_config.host,
        path: spotlight_config.path,
        port: spotlight_config.port,
        method:'POST',
        headers:{
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            'Content-Length': post_data.length
        }
    };
    // Set up the request
    var post_req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('error', function(e) {
          var response={};
          var output={'language':lang_arr,
          'endpoint':spotlight_config.host+':'+spotlight_config.port+spotlight_config.path,
          'error':e,
          'response':response}
          cb(output);
        });
        var body='';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            //console.log(body);
            try{
                var response=JSON.parse(body);
            }catch(e){
                var response={};
            }
            var output={'language':lang_arr,
            'endpoint':spotlight_config.host+':'+spotlight_config.port+spotlight_config.path,
            'error':0,
            'response':response}
            cb(output);
        });
    });
    // post the data
    post_req.write(post_data);
    post_req.end();
}
