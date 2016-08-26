## The Easier Way to Combine Salesforce and Angular 2

This boilerplate, which is still largely unifinished, combines the powers of [Gulp](http://gulpjs.com/), [JSForce](http://jsforce.github.io), [Angular 2](http://angular.io), and [Salesforce](https://salesforce.com) and allows you to develop and test your Salesforce applications completely locally. Deploying is as easy as running `gulp` or you can be more specific and just `gulp deploy:classes`.

### Getting set up

Setting up is super easy. First clone or fork this repository to your local machine with `git clone https://github.com/iDev0urer/salesforce-angular2-boilerplate.git` or, if you forked the repo, do `git clone YOUR-REPO-URL`. Then go to the salesforce-angular2-boilerplate directory with `cd salesforce-angular2-boilerplate`.

You will need [http://nodejs.org](NodeJs) in order to work with this so make sure you have that installed.

Once you're in the salesforce-angular2-boilerplate directory run `npm install`. This project also uses **gulp 4**, so install that:

```
npm rm -g gulp
npm install -g gulp-cli
```

If everything worked `gulp -v` should give you a version number over 4.

You will also need to copy the `config.sample.yaml` file to `config.yaml` and fill out the pertenent information. It should look like this:

```yaml
deploy:
  username:       user.name@yourcompany.com
  password:       YourPasswordAndPossiblySecurityToken
  login_url:      https://login.salesforce.com
  api_version:    36.0
  timeout:        120000
  poll_interval:  5000

visualforce:
  original_filename: index.vf.html
  rename_to: AngularApp.page
  controller_name: AngularAppController

resources:
  app_resource_name: AngularApp
  node_module_resource_name: NodeModules

options:
  debug: true
```

Lastly you will need to generate a private keypair to run the local express server through SSH. In your terminal while in the salesforce-angular2-boilerplate directory run:

```
openssl req \
       -newkey rsa:2048 -nodes -keyout ./ssh/domain.key \
       -x509 -days 365 -out ./ssh/domain.crt
```

Run though the setup and enter any information you want, it's not important. Finally check that a `.ssh` directory has been created and that it contains a `domain.key` and `domain.crt`.

**Note:** I am not sure how to do this on windows, although I'm fairly sure git-bash has openssl built in.

### Running the example

This boilerplate comes with a working example of a *contact management application*. To get it running just run the `gulp` command while in the   salesforce-angular2-boilerplate directory. It will open a local server at [https://localhost:8080](https://localhost:8080) where you should be able to view the working application. When you're ready to deploy the application and test it in Salesforce just run `gulp deploy` and wait for the application to finish deploying.


### Contributing

If you find something wrong or come up with a better way to do things please fork and pull request. I check Github several times daily and love seeing that little notification bubble.

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

##### [0.2.0] - 2016-08-26
- Refactored some methods in the Salesforce service
- Finished the ContactComponent (for now)
- Added a CreateContactComponent
- Made things work

##### [0.1.0] - 2016-08-23
- Added this repo to github
