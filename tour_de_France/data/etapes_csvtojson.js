//Converter Class
var fs = require("fs");
var Converter = require("csvtojson").Converter;
var fileStream = fs.createReadStream("etapes.csv");
//new converter instance
var converter = new Converter({constructResult:true});
//end_parsed will be emitted once parsing finished
converter.on("end_parsed", function (jsonObj) {
    fs.writeFile("etapes.json", JSON.stringify(jsonObj, null, 2));
});
//read from file
fileStream.pipe(converter);
