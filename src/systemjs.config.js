/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {

  var node_modules_directory = window._sf.node_modules_dir || 'node_modules/';
  var app_directory = window._sf.app_dir || '';

  // map tells the System loader where to look for things
  var map = {
    'app':                        app_directory + 'app', // 'dist',
    '@angular':                   node_modules_directory + '@angular',
    // 'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       node_modules_directory + 'rxjs',
    'jsforce':                    node_modules_directory + 'jsforce',
    'angular2-mdl':               node_modules_directory + 'angular2-mdl'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    // 'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'jsforce':                    { main: 'build/jsforce.min.js', defaultExtension: 'js' },
    'angular2-mdl':               { main: 'dist/components/index.js', defaultExtension: 'js' }
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
