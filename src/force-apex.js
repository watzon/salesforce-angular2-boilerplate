if (!sforce) {
    throw "unable to find sforce. Make sure that connection.js is loaded before apex.js script";
}

sforce.Apex = function(){
};


sforce.RunTestsRequest = function() {
};

sforce.RunTestsRequest.prototype = new sforce.Xml("RunTestsRequest");

sforce.Apex.prototype.namespaceMap = [{ns:"http://soap.sforce.com/2006/08/apex", prefix:""}];

sforce.Apex.prototype.executeAnonymous = function (string, callback) {
    var arg1 = new sforce.internal.Parameter("String", string, false);

    return sforce.connection._invoke("executeAnonymous",[arg1], false,
            callback, this.namespaceMap, (typeof UserContext.siteUrlPrefix != "undefined") ? UserContext.getUrl("/services/Soap/s/37.0") : "/services/Soap/s/37.0", this.namespaceMap[0].ns);
};

sforce.Apex.prototype.setDebug = function (flag, level, categories) {
    if (flag) {
        sforce.debug.apexTrace = true;
        sforce.connection.debuggingHeader = {debugLevel : (level ? level : "Db"), debugCategories : (categories ? categories : null)};
    } else {
        sforce.debug.apexTrace = false;
        sforce.connection.debuggingHeader = null;
    }
};

sforce.Apex.prototype.execute = function (pkg, method, args, callback, isArray) {
    pkg = pkg.replace(/\./g, "/");

    var sobjectNs = "http://soap.sforce.com/schemas/package/" + pkg;
    var nsmap = [{ns:sobjectNs, prefix:""}];

    if (!args) {
        throw "args not specified";
    }

    var params = [];
    for (var field in args) {
        var value = args[field];
        if (typeof value != "function") {
            var arrayParam = value === null ? false : (value.push?true:false);
            var param = new sforce.internal.Parameter(field, value, arrayParam);
            params.push(param);
        }
    }

    var isRealArray = true;

    if (isArray === false) {
        isRealArray = false;
    }

    return sforce.connection._invoke(method, params, isRealArray, callback, nsmap,
            ((typeof window.UserContext != "undefined") ? UserContext.getUrl("/services/Soap/package/") : "/services/Soap/package/") + pkg, sobjectNs, sobjectNs);
};

sforce.Apex.prototype.runTests = function (request, callback) {
    var arg1 = new sforce.internal.Parameter("RunTestsRequest", request, false);

    return sforce.connection._invoke("runTests",[arg1], false,
            callback, this.namespaceMap, "https://ns30.salesforce.com/services/Soap/s/37.0", this.namespaceMap[0].ns);
};

sforce.apex = new sforce.Apex();
