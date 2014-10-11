DBpediaSpotlight.js
============

NodeJS package for DBpedia Spotlight

## About
DBpediaSpotlight.js provides contextual knowledge for your text by extracting the mentions of Wikipedia articles (i.e. DBpedia resources) using multilingual support.
For more information, check out DBpedia Spotlight https://github.com/dbpedia-spotlight/

## Installation

  npm install dbpedia-spotlight --save

## Usage
```javascript
  //use default endpoints
  var mlspotlight = require('dbpedia-spotlight');
  input="My text to be analyzed."
  mlspotlight.annotate(input,function(output){
    console.log(output);
  })

  //use custom endpoints
  mlspotlight.configEndpoints(
    {
      "english": {
      host:'context.aksw.org',
      path:'/spotlight/english',
      port:'8080',
      confidence:0,
      support:0
      },
      "persian": {
      host:'context.aksw.org',
      path:'/spotlight/persian',
      port:'8020',
      confidence:0.5,
      support:0
      },
    }
  );
  mlspotlight.annotate(input,function(output){
    console.log(output);
  })

  //fix to a specific endpoint (i.e. disabling language detection)
  mlspotlight.fixToEndpoint('german');
  //unfix endpoint (i.e. enabling language detection)
  mlspotlight.unfixEndpoint();
  ```
