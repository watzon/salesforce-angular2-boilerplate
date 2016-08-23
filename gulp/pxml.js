// Builds a package.xml file from a json input
// Sample package.xml JSON structure:
// 
// {
// 		'ApexClass': [
// 			'Class_Name_One',
// 			'Class_Name_Two'
// 		],
// 		'StaticResource': [
// 			'Some_Static_Resource'
// 		],
// 		'ApexPage': [
// 			'Page_One'
// 		]
// }
'use strict';

const xml = require('xml'),
	  _ = require('lodash'),
	  fs = require('fs'),
	  path = require('path');

// Nonexhaustive map of lowercase directory names to CamelCase
// standard object names
let NameMap = {
	'classes': 'ApexClass',
	'labels': 'CustomLabels',
	'pages': 'ApexPage',
	'staticresources': 'StaticResource',
	'triggers': 'ApexTrigger'
};

class PackageXML {

	// Constructor function
	// @param data<object> JSON object representing a package.xml file
	// @param version<string> a string representation of the api version to use. Default 36.0
	constructor(data, version) {
		this.data = data || {};
		this.version = version || '36.0';
		this._output = '';
	}

	// Takes the data from `this.data` and generates a package.xml
	// string from it.
	// 
	// @return string String form or package.xml
	generate() {
		let data = this.reserialize();
		let x = xml(data, { declaration: true });
		this._output = x;
		return this;
	}

	// Save the generated package.xml to a file
	// 
	// @param name The path/name of the file
	save(name) {
		return fs.writeFileSync(this.to_string(), name);
	}

	// Generates an instance of the PackageXML class using a directory.
	// 
	// @param dir<string> The directory to create the package.xml from
	// @return PackageXML
	static from_dir(dir, version) {

		let tree = PackageXML._dirTree(dir);
		if (tree.type === 'file') {
			console.error('The from_dir function only works with valid directories');
			return;
		}

		let children = tree.children || {};
		let pkg = {};
		// Filter out any files. We only want folders at this point.
		children = _.filter(children, (o) => { return o.type === 'folder'; });

		for (let child of children) {
			if (!NameMap.hasOwnProperty(child.name)) {
				console.error('NameMap has no property ' + child.name);
				continue;
			}

			let sObjectName =  NameMap[child.name];
			let members = [];
			// Filter out meta.xml files and folders
			let children = _.filter(child.children, (o) => {
				let re = /(-meta\.xml)/i;
				return !re.exec(o['name']);
			});

			_.each(children, (c) => {
				let name = c.name.replace(path.extname(c.name), '');
				members.push(name);
			});

			pkg[sObjectName] = members;

		}

		return new PackageXML(pkg, version);

	}

	// Take a json object representing a package.xml file and
	// reserializes it into a different, more convoluted, json
	// structure with namespaces and a root element
	// 
	// @param data json object representing a package.xml file
	reserialize() {

		let pkg = {
			'Package': [
				{
					'_attr': {
						'xmlns': 'http://soap.sforce.com/2006/04/metadata'
					}
				}
			]
		};

		for (let property in this.data) {
			if (this.data.hasOwnProperty(property)) {
				let obj = {};

				// Create an empty array to hold our <types> element
				obj['types'] = [];

				// Push the property as a member of <types>
				obj['types'].push({ 'name': property });

				// Loop through the elements in the element and add each
				// as a <members> element
				_.each(this.data[property], (el) => {
					obj['types'].push({'members': el});
				});

				pkg['Package'].push(obj);
			}
		}

		// Add the API verison to the bottom
		pkg['Package'].push({ 'version': this.version });

		return pkg;

	}

	// Return the results of `generate()` as a formatted xml string
	to_string() {
		return this._format(this._output);
	}

	_format(x) {
	    var formatted = '';
	    var reg = /(>)(<)(\/*)/g;
	    x = x.replace(reg, '$1\r\n$2$3');
	    var pad = 0;
	    _.forEach(x.split('\r\n'), function(node, index) {
	        var indent = 0;
	        if (node.match( /.+<\/\w[^>]*>$/ )) {
	            indent = 0;
	        } else if (node.match( /^<\/\w/ )) {
	            if (pad != 0) {
	                pad -= 1;
	            }
	        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
	            indent = 1;
	        } else {
	            indent = 0;
	        }

	        var padding = '';
	        for (var i = 0; i < pad; i++) {
	            padding += '  ';
	        }

	        formatted += padding + node + '\r\n';
	        pad += indent;
	    });

	    return formatted;
	}

	static _dirTree(filename) {
	    var stats = fs.lstatSync(filename),
	        info = {
	            path: filename,
	            name: path.basename(filename)
	        };

	    if (stats.isDirectory()) {
	        info.type = 'folder';
	        info.children = fs.readdirSync(filename).map((child) => {
	            return this._dirTree(path.join(filename, child));
	        });
	    } else {
	        // Assuming it's a file. In real life it could be a symlink or
	        // something else!
	        info.type = 'file';
	    }

	    return info;
	}
}

module.exports = PackageXML;