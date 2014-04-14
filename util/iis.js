var shell = require('./shell');

var start = function(name){
	//shell.run('appcmd', ['start', 'site', name]);
	shell.run('iisreset', ['/start']);
}

var stop = function(name){
	//shell.run('appcmd', ['stop', 'site', name]);
	shell.run('iisreset', ['/stop']);
}

module.exports.start = start;
module.exports.stop = stop;
