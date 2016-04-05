//TODO: write some test cases
var should = require('chai').should(),
    mlspotlight = require('../index'),
    annotate = mlspotlight.annotate;
var util = require('util');

var input="First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany, hosting 147 foreign embassies.";
 mlspotlight.annotate(input,function(output){
    console.log(util.inspect(output, false, null));
    mlspotlight.fixToEndpoint('german');
    mlspotlight.annotate(input,function(output){
       console.log(util.inspect(output, false, null));
     });
  });

/*
describe('#annotate', function() {
  it('annotate a sample text in Engligh;', function() {
    var input='test';
    var output='';
    annotate(input).should.equal(output);
  });

});
*/
