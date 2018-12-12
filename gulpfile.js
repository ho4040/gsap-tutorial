const browserSync = require('browser-sync');
const gulp = require('gulp');

gulp.task('serve', function(){
    initBrowserSync('src');
    let watcher = gulp.watch("src/**");
    watcher.on("change", function(evt){
        browserSync.reload(evt.path);
    })
})

function initBrowserSync(baseDir){
    browserSync.init({
        server:{
            baseDir:baseDir,
            routes:{
                '/libs':"node_modules",
                '/static':'resources'
            }
        },
        single:true,
        startPath:"/",
        browser:"chrome"
    })
}