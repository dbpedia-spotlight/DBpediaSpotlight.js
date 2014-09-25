MDBSpotlight
============

Multilingual DBpedia Spotlight for Named Entity Recognition

## Installation

  npm install multi-db-spotlight --save

## Usage
```javascript
  //use default endpoints
  var mlspotlight = require('MDBSpotlight');
  input="My text to be analyzed."
  mlspotlight.annotate(input,function(output){
    console.log(output);
  })

  //use custome endpoints
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
  ```
