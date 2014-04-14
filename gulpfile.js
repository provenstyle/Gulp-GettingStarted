var gulp = require('gulp');
var help = require('gulp-task-listing');
var clean = require('gulp-clean');
var service = require('./util/windowsService');
var iis = require('./util/iis');

var servicesToStart = [
	'ADAM_WatchGuardLDS',
	'WatchGuardTokenService',
	'WatchGuardHostedService',
	'WatchGuard LVS Service'
];

var servicesToStop = [
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
	servicesToStart.forEach(service.start);
});

gulp.task('stopServices', function(){
	servicesToStop.forEach(service.stop);
});

gulp.task('startIIS', function(){
	iis.start();
});

gulp.task('stopIIS', function(){
	iis.stop()
});

gulp.task('deleteLogs', ['stopIIS', 'stopServices'], function(){
	gulp.src('c:/WatchGuardVideo/Logs/**', {read: 'false'})
		.pipe(clean({force: true}));
});
