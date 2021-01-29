var fs = require('fs');

function getRandomPhrase() {
    var line;
    fs.readFile('phrases.txt', 'utf8', function(err, data) {
        var lines = data.split("\n");
        line = lines[getRandomArbitrary(1, 26)];
        console.log(line);
        //hacer el método acá :) :( 
    });

}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

getRandomPhrase()