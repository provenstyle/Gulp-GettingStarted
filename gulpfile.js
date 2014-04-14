var gulp = require('gulp');
var help = require('gulp-task-listing');
var spawn = require('child_process').spawn;

var startServices = [
	'ADAM_WatchGuardLDS',
	'WatchGuardTokenService',
	'WatchGuardHostedService',
	'WatchGuard LVS Service'
];

var stopServices = [
	'WatchGuard LVS Service',
	'WatchGuardHostedService',
	'WatchGuardTokenService',
	'ADAM_WatchGuardLDS'
];

gulp.task('help', help);

gulp.task('default', function(){
	var msg = "Default task doesn't do anything yet!";
	debugger;
	console.log(msg);
});

gulp.task('startServices', function(){
	for(var i = 0; i < startServices.length; i++){
		run('sc', ['start', startServices[i]]);
	}
});

gulp.task('stopServices', function(){
	for(var i = 0; i < stopServices.length; i++){
		run('sc', ['stop', stopServices[i]]);
	}
});

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