import { Injectable, Optional, NgZone } from '@angular/core';
import { LoggerService } from './logger.service';
import 'rxjs/add/operator/toPromise';
let jsforce = require('jsforce');

export enum API {
	REST,
	VFR
}

@Injectable()
export class SalesforceService {

	public conn: any;
	public useRest: boolean = (<any>window).local || false;
	public apiVersion: string = '34.0'
	private restConnectionType: ['soap', 'oauth'];
	public oauth2: any;

	public beforeHook: (controller?: string, method?: string, params?: Object, api?: API) => boolean;
	public afterHook:  (error?: string, result?: any) => void;

	constructor(private _zone: NgZone, private log: LoggerService) {
		
	}

	public authenticate(login_url: string,
		username: string,
		password: string,
		oauth2?: any): Promise<any> {
		if (!this.conn) {
			this.log.info('Authenticating with jsforce.');
			this.conn = new jsforce.Connection({
				loginUrl: login_url,
				version: this.apiVersion,
				proxyUrl: (<any>window).local ? '/proxy/' : undefined,
				oauth2: oauth2
			});

			return this.conn.login(username, password);
		} else {
			this.log.warn('Already authenticated. No need to reauth.');
			return new Promise<any>((resolve, reject) => {
				resolve(this.conn.userInfo);
			});
		}
	}

	/**
	 * @param  {string} controller 	- The APEX controller to use
	 * @param  {string} method 		- The method to execute on the controller. To use
	 * 						     	  both REST and Visualforce Remoting the methods
	 * 						          must be tagged with both `@RemoteAction` and `WebService`
	 * @param  {Object} params      - Parameters to pass to the APEX method as an object with
	 * 							      the format `{ parameter_name: value }`
	 * @return {Promise<any>} 	      Returns a promise with the result or rejects with the
	 * 						          remoting exception. 
	 */
	public execute(controller: string, method: string, params?: Object): Promise<any> {
		this.log.group('Executing method: ' + method);
		this.log.info('Controller: ', controller);
		this.log.info('Params:',params);

		let p: Promise<any> = new Promise((resolve, reject) => {
			if (this.useRest) {
				this.log.info('Using REST API');
				
				let beforeHookResult = this.runBeforeHook(controller, method, params, API.REST);
				
				if (beforeHookResult) {
					this.execute_rest(controller, method, params)
						.then((res) => {
							this.log.info('Result: ', res);
							resolve(res);
							this.runAfterHook(null, res);
						}, (reason) => {
							this.log.error(reason);
							reject(reason);
							this.runAfterHook(reason, null);
						});
				} else {
					let reason = 'Before hook failed';
					reject(reason);
					this.runAfterHook(reason, null);
				}

			} else {
				this.log.info('Using Visualforce Remoting');

				let beforeHookResult = this.runBeforeHook(controller, method, params, API.VFR);

				if (beforeHookResult) {
					let tmp = [];
					for (let i in params) {
						tmp.push(params[i]);
					}

					this.execute_vfr(controller, method, tmp)
							.then((res) => {
								this.log.info('Result: ', res);
								resolve(res);
								this.runAfterHook(null, res);
							}, (reason) => {
								this.log.error(reason);
								reject(reason);
								this.runAfterHook(reason, null);
							});
				} else {
					let reason = 'Before hook failed';
					reject(reason);
					this.runAfterHook(null, reason);
				}
			}
		});

		this.log.groupEnd();
		return p;
	}

	public execute_rest(pkg: string, method: string, params: Object): Promise<any> {
		let callback = function() { };
		pkg = pkg.replace(/\./g, "/");

		let endpointUrl = this.conn.instanceUrl + '/services/Soap/package/' + pkg;
		let soap = new jsforce.SOAP(this.conn, {
			xmlns: `http://soap.sforce.com/schemas/package/${pkg}`,
			endpointUrl: endpointUrl
		});

		return new Promise((resolve, reject) => {
			this._zone.runOutsideAngular(() => {
				soap.invoke(method, params, callback)
				.then((res) => {
					let result = this.parseSoapResult(res);
					resolve(result);
				}, (reason) => {
					reject(reason);
				});
			});
			this._zone.run(() => {});
		});
	}

	private execute_vfr(controller: string, method: string, params: Array<any>): Promise<any> {
		// Set ctrl to the Visualforce Remoting controller
		let ctrl: any = window[controller] || {};
		let self = this;

		// Make sure the controller has the method we're attempting to call
		if (ctrl.hasOwnProperty(method)) {

			let methodFunc = ctrl[method];
			let directCfg = methodFunc.directCfg;

			return new Promise((resolve, reject) => {
				this._zone.runOutsideAngular(() => {
					// The wrong number of parameters were included
					if (params.length !== directCfg.method.len) {
						reject('Wrong number of parameters included');
						return;
					}

					let callback = function(res, err) {
						if (res) {
							res = self.arrayify(res);
							resolve(res);
						} else {
							reject(err.message);
						}
					}

					params.push(callback);
					ctrl[method].apply(null, params);
				});
				this._zone.run(() => {});
			});
		} else {
			return new Promise((resolve, reject) => {
				reject('The requested method does not exist on ' + controller);
			});
		}
	}

	private runBeforeHook(method: string, controller: string, params: Object, api: API): boolean {
		let beforeHookResult = true;
		if (this.beforeHook) {
			this.log.info('Executing before hook');
			beforeHookResult = this.beforeHook.apply(this, [controller, method, params, API.REST]);
			this.log.info('Before hook completed with status: ', beforeHookResult);
		}
		return beforeHookResult;
	}

	private runAfterHook(error: string, result: any): void {
		if (this.afterHook) {
			this.log.info('Executing after hook');
			this.afterHook.apply(this, [error, result]);
			this.log.info('After hook completed');
		}
	}

	private parseSoapResult(result: any): Array<Object> {
		if (!result) { return null; }
		result = result.result;
		if (typeof(result) === 'string') { result = JSON.parse(result); }
		if (!Array.isArray(result)) { result = [result]; }
		for (let i in result) {
			result[i] = this.stripNamespace(result[i]);
		}
		return result;
	}

	private arrayify(obj: any): Array<any> {
		let res;
		if (!Array.isArray(obj) && typeof(obj) === 'object') { res = [obj]; }
		else { res = obj; }
		return res;
	}

	private normalizeType(val: any): any {

		let dateRegex = /[0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2}/i;

		if (!isNaN(val)) {
			return +val;
		} else if (val == 'true' || val == 'false') {
			return JSON.parse(val);
		} else if (dateRegex.test(val)) {
			return Date.parse(val);
		} else {
			return val;
		}
	}

	private stripNamespace(obj: Array<Object>): Array<Object> {
		let temp = JSON.parse(JSON.stringify(obj)); // Clone the object
		for (let k in temp) {
			if (k === '$') {
				delete temp[k];
			} else if (k.indexOf(':') > -1) {
				let t = k.substr(k.indexOf(":") + 1);
				temp[t] = this.arrayify(temp[k]);
				delete temp[k];

				if (Array.isArray(temp[t])) {
					for (let i in temp[t]) {
						if (temp[t][i]['sf:records']) {
							temp[t][i] = temp[t][i]['sf:records'];
						}
						temp[t][i] = this.stripNamespace(temp[t][i]);
					}
				}

				temp[t] = this.normalizeType(temp[t]);
			} else if (typeof (temp[k]) == 'object') {
				if (k !== '0') {
					temp[k] = this.arrayify(temp[k]);
				}
				temp[k] = this.stripNamespace(temp[k]);
			}
		}
		return temp;
	}

}
