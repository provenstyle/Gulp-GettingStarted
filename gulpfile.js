var Q = require('q');
var gulp = require('gulp');
var help = require('gulp-task-listing');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var wait = require('./util/wait');
var service = require('./util/windowsService');
var iis = require('./util/iis');
var msbuild = require('./util/msbuild');

var logPath = 'C:/WatchGuardVideo/Logs/**',
	root = 'C:/Watchguard/Newton/Newton/', 
	servicesToStart = [
		'ADAM_WatchGuardLDS',
		'WatchGuardTokenService',
		'WatchGuardHostedService',
		'WatchGuard LVS Service'
	],
	servicesToStop = [
		'WatchGuard LVS Service',
		'WatchGuardImportService',
		'WatchGuardHostedService',
		'WatchGuardTokenService',
		'ADAM_WatchGuardLDS'
	];

function build(){
	var buildFile = root + 'Live Video Streaming/Live Video Streaming.msbuild';
	return msbuild.build(buildFile, ['clean', 'release', 'test']);
}

gulp.task('help', help);

gulp.task('default', function(){
	var msg = "Default task doesn't do anything yet!";
	console.log(msg);
});

gulp.task('build', function(){
	return build();
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
	return gulp.src(logPath, {read: 'false'})
			.pipe(clean({force: true}));
});

gulp.task('startAll', ['startIIS', 'startServices']);

gulp.task('copyConfigs', ['_copyConfigs'], function(){
	return build();
});

gulp.task('_copyConfigs', ['_copyELConfig', '_copyHostConfig', '_copyHostLogConfig', '_copyLVSConfig', '_copyJSConfig', '_copyWebConfig']);

gulp.task('_copyELConfig', ['stopServices'], function(){
	return gulp.src('C:/Watchguard/Newton/Configs/EvidenceLibrary/WGEvidLibrary.exe.config')
			.pipe(rename('App.config'))
			.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Evidence Library/WatchGuard.EvidenceLibrary'));
});

gulp.task('_copyHostConfig', ['stopServices'], function(){
	return gulp.src('C:/Watchguard/Newton/Configs/HostedServices/Services.Host.WinService.exe.config')
			.pipe(rename('App.config'))
			.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Hosted Services/Services.Host.WinService'));
});

gulp.task('_copyHostLogConfig', ['stopServices'], function(){
	return gulp.src('C:/Watchguard/Newton/Configs/HostedServices/log4net.config')
			.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Hosted Services/Services.Host.WinService'));
});

gulp.task('_copyLVSConfig', ['stopServices'], function(){
	return gulp.src('C:/Watchguard/Newton/Configs/LVS.Service/Services.Host.LVS.exe.config')
			.pipe(rename('App.config'))
			.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Live Video Streaming/Services.Host.LVS'));
});

gulp.task('_copyJSConfig', ['stopServices'], function(){
	return gulp.src('C:/Watchguard/Newton/Configs/LVS.Web/config.js')
			.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Live Video Streaming/LVS.Web'));
});

gulp.task('_copyWebConfig', ['stopServices'], function(){
	return gulp.src('C:/Watchguard/Newton/Configs/LVS.Web/Web.config')
			.pipe(gulp.dest('C:/Watchguard/Newton/Newton/Live Video Streaming/LVS.Web'));
});