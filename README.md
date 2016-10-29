# The Easier Way to Combine Salesforce and Angular 2

This boilerplate, which is still largely unifinished, combines the powers of [Gulp](http://gulpjs.com/), [JSForce](http://jsforce.github.io), [Angular 2](http://angular.io), and [Salesforce](https://salesforce.com) and allows you to develop and test your Salesforce applications completely locally. Deploying is as easy as running `gulp` or you can be more specific and just `gulp deploy:classes`.

### Getting set up

Setting up is super easy. First clone or fork this repository to your local machine with `git clone https://github.com/iDev0urer/salesforce-angular2-boilerplate.git` or, if you forked the repo, do `git clone YOUR-REPO-URL`. Then go to the salesforce-angular2-boilerplate directory with `cd salesforce-angular2-boilerplate`.

You will need [NodeJs](http://nodejs.org) in order to work with this so make sure you have that installed.

Once you're in the salesforce-angular2-boilerplate directory run `npm install`. This project also uses **gulp 4**, so install that:

```
npm rm -g gulp
npm install -g gulp-cli
```

If everything worked `gulp -v` should give you a version number over 4.

You will also need to copy the `config.sample.js` file to `config.js` and fill out the pertenent information. It should look like this:

```javascript
module.exports = {
    deploy: {
        username:       'user.name@yourcompany.com',
        password:       'YourPasswordAndPossiblySecurityToken',
        login_url:      'https://login.salesforce.com',
        api_version:    36.0,
        timeout:        120000,
        poll_interval:  5000,
    },

    visualforce: {
        template: 'index.page.html',
        page: 'AngularApp',
        controller: 'AngularAppController'
    },

    resources: {
        app_resource_name: 'AngularApp',
        node_module_resource_name: 'NodeModules',
    },

    options: {
        
    }
}
```

### Running the example

This boilerplate comes with a working example of a **contact management application**. To get it running just run the `gulp` command while in the salesforce-angular2-boilerplate directory. It will open a local server at [http://localhost:8080](http://localhost:8080) where you should be able to view the working application. When you're ready to deploy the application and test it in Salesforce just run `gulp deploy` and wait for the application to finish deploying.

### File Tree

The way I have structured this project bears describing; whether you are new to Salesforce, Angular 2, both, or just need some explianation.

#### gulp

The gulp directory contains most of the gulp tasks separated into different files.

+ deploy.js - Contains tasks specific to deployment such as the task that creates the package.xml and the actual jsforce-deploy task.
    - **Tasks**
    - clean-tmp
    - clean-build
    - clean-resources
    - init-deploy
    - tempgen:visualforce
    - tempgen:node_modules
    - tempgen:app
    - tempgen:salesforce
    - tempgen:pxml
    - tempgen:meta-xml
    - package:node_modules
    - package:app
    - package-resources
    - tempgen
    - deploy:jsforce
    - **deploy**
    - **deploy:classes**
+ html.js - Contains the tasks that add template values to the html file and can also turn it into a visualforce page
    - **Tasks**
    - html:dev
    - html:prod
    - visualforce:dev
    - visualforce:prod
    - **watch:html**
+ scripts.js - Contains tasks that compile Typescript and move javascript files to the build directory
    - **Tasks**
    - typescript:dev
    - typescript:prod
    - javascript:dev
    - javascript:prod
    - **scripts:dev**
    - **scripts:prod**
    - **watch:scripts**
+ styles.js - Contains tasks that compile SASS and move css files to the build directory
    - **Tasks**
    - sass:dev
    - sass:prod
    - css:dev
    - css:prod
    - **styles:dev**
    - **styles:prod**
    - **watch:styles**

The main gulp tasks are located in `gulpfile.js` in the root directory. They are:

+ serve - starts the local development server
+ watch:all - Watches scripts, styles, and html and compiles on change
+ default - starts the server and watches files

#### src

The `src` directory contains all of the Source files; Typescript, javascript, sass, html/visualforce, and salesforce specific such as APEX classes.

##### app

The app directory contains all of the Angular 2 files. These are separated into categories such as `components`, `directives`, `pipes`, `resolves`, `services`, and `shared`.

##### salesforce

The salesforce directory is packaged up and deployed with the resource. You can add any Salesforce files you want here such as APEX Classes.

##### styles

Fairly self explanitory the styles directory contains global styles for the app.


Thank you @tylerzika for the suggestion to add this section!

### Contributing

If you find something wrong or come up with a better way to do things please fork and pull request. I check Github several times daily and love seeing that little notification bubble.

### Known Issues

So far things seem to be working well for the most part. Some things that I have noticed are:

+ Visualforce Remoting and WebServices use different date formats. I have tried to compensate for those differences in the Salesforce service with the `parseSoapResult` and `convertDate` methods, but I may have missed an edge case.

### License

The MIT License

Copyright (c) 2010-2016 Chris Watson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

### Changelog

##### [0.7.0] - 2016-10-28
- Updated README to describe directory structure
- Removed unnecessary typings
- Modified `salesforce.service.ts` and added `self` variable as reference to `this`
- Merged pull requests #5 and #6

##### [0.6.1] - 2016-09-01
- Added Gravatar directive to get use pictures rather than pulling them from Salesforce

##### [0.6.0] - 2016-09-01
- Updated Angular app to version 2.0.0-rc.6. See the [Angular 2 Changelog](https://github.com/angular/angular/blob/master/CHANGELOG.md) for breaking changes.

##### [0.5.0] - 2016-09-01
- Restructured config files. Now using `config.js` rather than `yaml`
- Took the `pxml.js` file which is used for `package.xml` generation and refactored it out into it's [own module](http://npmjs.org/package/pxml)
- Refactored gulpfiles to fit with new config

##### [0.4.3] - 2016-08-30
- Fixed bug with `ngZone` causing `execute` method to fire twice when within `ngOnInit`

##### [0.4.2] - 2016-08-30
- Removed https requirement from local server. Use [http://localhost:8080](http://localhost:8080) now
- Added components to `app.module.ts` declarations
- Made changes to forked version of jsforce and updated `salesforce.service.ts` to reflect those changes.

##### [0.3.0] - 2016-08-27
- Added SOQL class to build SOQL queries

##### [0.2.0] - 2016-08-27
- Refactored some methods in the Salesforce service
- Finished the ContactComponent (for now)
- Added a CreateContactComponent
- Fixed some bugs

##### [0.1.0] - 2016-08-23
- Added this repo to github
