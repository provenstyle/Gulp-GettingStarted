var Q = require('q');
var gulp = require('gulp');
var help = require('gulp-task-listing');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var wait = require('./util/wait');
var service = require('./util/windowsService');
var iis = require('./util/iis');

var logPath = 'c:/WatchGuardVideo/Logs/**',
	root = 'c:/Watchguard/Newton/Newton', 
	servicesToStart = [
		'ADAM_WatchGuardLDS',
		'WatchGuardTokenService',
		'WatchGuardHostedService',
		'WatchGuard LVS Service'
	],
	servicesToStop = [
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
	gulp.src(logPath, {read: 'false'})
		.pipe(clean({force: true}));
});

gulp.task('startAll', ['startIIS', 'startServices']);

gulp.task('copyConfigs', ['stopServices'], function(){
	gulp.src('C:/Watchguard/Newton/Configs/EvidenceLibrary/WGEvidLibrary.exe.config')
		.pipe(rename('App.config'))
		.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Evidence Library/WatchGuard.EvidenceLibrary'));

	gulp.src('C:/Watchguard/Newton/Configs/HostedServices/Services.Host.WinService.exe.config')
		.pipe(rename('App.config'))
		.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Hosted Services/Services.Host.WinService'));

	gulp.src('C:/Watchguard/Newton/Configs/HostedServices/log4net.config')
		.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Hosted Services/Services.Host.WinService'));

	gulp.src('C:/Watchguard/Newton/Configs/LVS.Service/Services.Host.LVS.exe.config')
		.pipe(rename('App.config'))
		.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Live Video Streaming/Services.Host.LVS'));

	gulp.src('C:/Watchguard/Newton/Configs/LVS.Web/config.js')
		.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Live Video Streaming/LVS.Web'));

	gulp.src('C:/Watchguard/Newton/Configs/LVS.Web/Web.config')
		.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Live Video Streaming/LVS.Web'));
});