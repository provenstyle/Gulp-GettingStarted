var shell = require('./shell');

var start = function(name){
	shell.run('sc', ['start', name]);
}

var stop = function(name){
	shell.run('sc', ['stop', name]);
}

module.exports.start = start;
module.exports.stop = stop;