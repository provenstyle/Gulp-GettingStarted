var Q = require('q');
var gulp = require('gulp');
var help = require('gulp-task-listing');
var clean = require('gulp-clean');
var wait = require('./util/wait');
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
	console.log(msg);
});

gulp.task('startServices', function(){
	return wait.onAll(servicesToStart, service.start);
});

gulp.task('stopServices', function(){
	return wait.onAll(servicesToStop, service.stop);
});

gulp.task('startIIS', function(){
	return iis.start();
});

gulp.task('stopIIS', function(){
	return iis.stop()
});

gulp.task('deleteLogs', ['stopIIS', 'stopServices'], function(){
	gulp.src('c:/WatchGuardVideo/Logs/**', {read: 'false'})
		.pipe(clean({force: true}));
});

gulp.task('startAll', ['startIIS', 'startServices']);

