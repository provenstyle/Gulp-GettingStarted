var spawn = require('child_process').spawn;
var Q = require('q');

function run(cmd, args) {
    var def = Q.defer();
	var child = spawn(cmd, args);

    child.stdout.on('data', function (data) {
    	console.log('stdout: ' + data.toString());
    });
    child.stderr.on('data', function (data) {
    	console.log('stderr: ' + data.toString());
        def.reject('An error occured while calling: ' + fullCommand());
    });
    child.on('close', function(code){
    	console.log('command: ' + fullCommand() + ' exited with code: ' + code);
        def.resolve();
    });

    function fullCommand(){
		var temp = cmd;
		for(var i = 0; i < args.length; i++){
	    	temp += " " + args[i];
		}
		return '[' + temp + ']';
	}

    return def.promise;
}

module.exports.run = run;