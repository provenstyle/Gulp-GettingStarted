var spawn = require('child_process').spawn;

function run(cmd, args) {
	var child = spawn(cmd, args);

    child.stdout.on('data', function (data) {
    	console.log('stdout: ' + data.toString());
    });
    child.stderr.on('data', function (data) {
    	console.log('stderr: ' + data.toString()); 
    });
    child.on('close', function(code){
    	console.log('command: ' + fullCommand() + ' exited with code: ' + code);
    });

    function fullCommand(){
		var temp = cmd;
		for(var i = 0; i < args.length; i++){
	    	temp += " " + args[i];
		}
		return '[' + temp + ']';
	}
}

module.exports.run = run;