/*
Salesforce.com AJAX Connector 36.0
Copyright, 1999, salesforce.com, inc.
All Rights Reserved
*/
/** check if sforce is already created by some other lib*/
window.sforce = window.sforce || {};

sforce.internal = {};
/** StringBuffer */

sforce.StringBuffer = function() {
    this.buffer = [];

    this.append = function (s) {
        this.buffer.push(s);
        return this;
    };

    this.toString = function() {
        return this.buffer.join("");
    };
};

/** Base64Binary */
sforce.Base64Binary = function(text) {
    this.input = text;
};

sforce.Base64Binary.prototype.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

sforce.Base64Binary.prototype.toString = function() {
    var output = [];
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
        chr1 = this.input.charCodeAt(i++);
        chr2 = this.input.charCodeAt(i++);
        chr3 = this.input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output.push(this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4));
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < this.input.length);
    return output.join("");
};

sforce.Base64Binary.prototype.decode = function(input) {
    var output = [];
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='\n" + "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
        enc1 = this.keyStr.indexOf(input.charAt(i++));
        enc2 = this.keyStr.indexOf(input.charAt(i++));
        enc3 = this.keyStr.indexOf(input.charAt(i++));
        enc4 = this.keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output.push(String.fromCharCode(chr1));
        if (enc3 != 64) {
            output.push(String.fromCharCode(chr2));
        }
        if (enc4 != 64) {
            output.push(String.fromCharCode(chr3));
        }
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output.join("");
};

/**DateCodec.js*/

sforce.internal.dateToString = function(theDate) {
    var today = theDate;
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    return  year + "-" + month + "-" + day;
};

sforce.internal.dateTimeToString = function(theDate) {
    var today = theDate;
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();

    var offset = today.getTimezoneOffset();
    var pm = (offset < 0) ? "+" : "-";
    offset = Math.abs(offset);
    var hourdifference = offset / 60;
    var minutedifference = offset % 60;

    if (second <= 9) {
        second = "0" + second;
    }

    var milli = today.getMilliseconds();
    if (milli !== 0) {
        milli = "." + milli;
        if (milli.length > 4) {
            milli = milli.substring(0, 4);
        }
        second = second + milli;
    }

    var timezone;

    if (offset === 0) {
        timezone = "Z";
    } else {
        if (minutedifference < 10) {
            minutedifference = "0" + minutedifference;
        }
        if (hourdifference < 10) {
            hourdifference = "0" + hourdifference;
        }
        timezone = pm + hourdifference + ":" + minutedifference;
    }

    if (month <= 9) {
        month = "0" + month;
    }
    if (day <= 9) {
        day = "0" + day;
    }
    if (hour <= 9) {
        hour = "0" + hour;
    }
    if (minute <= 9) {
        minute = "0" + minute;
    }

    return  year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + timezone;
};


sforce.internal.stringToDate = function(source) {
    var bc = false;
    if (source === null || source.length === 0) {
        throw "Unable to parse dateTime";
    }

    if (source.charAt(0) == '+') {
        source = source.substring(1);
    }

    if (source.charAt(0) == '-') {
        source = source.substring(1);
        bc = true;
    }

    if (source.length != 10) {
        throw ("Unable to parse date, " + source + " length != 10");
    }

    if (source.charAt(4) != '-' || source.charAt(7) != '-') {
        throw ("Unable to parse date");
    }

    var year = source.substring(0, 4);
    var month = source.substring(5, 7);
    var day = source.substring(8, 10);

    var date = new Date(year, month-1, day, 0, 0, 0);
    date.setMilliseconds(0);
    return date;
};


sforce.internal.stringToDateTime = function(source) {
    var bc = false;
    if (source === null || source.length === 0) {
        throw "Unable to parse dateTime";
    }

    if (source.charAt(0) == '+') {
        source = source.substring(1);
    }
    if (source.charAt(0) == '-') {
        source = source.substring(1);
        bc = true;
    }

    if (source.length < 19) {
        throw ("Unable to parse dateTime");
    }

    if (source.charAt(4) != '-' || source.charAt(7) != '-' ||
        source.charAt(10) != 'T') {
        throw ("Unable to parse dateTime");
    }

    if (source.charAt(13) != ':' || source.charAt(16) != ':') {
        throw ("Unable to parse dateTime");
    }

    var year = source.substring(0, 4);
    var month = source.substring(5, 7);
    var day = source.substring(8, 10);
    var hour = source.substring(11, 13);
    var min = source.substring(14, 16);
    var sec = source.substring(17, 19);

    var date = new Date(year, month-1, day, hour, min, sec);

    var pos = 19;

    // parse optional milliseconds
    if (pos < source.length && source.charAt(pos) == '.') {
        var milliseconds = 0;
        var start = ++pos;
        while (pos < source.length && sforce.internal.isDigit(source.charAt(pos))) {
            pos++;
        }
        var decimal = source.substring(start, pos);
        if (decimal.length == 3) {
            milliseconds = decimal;
        } else if (decimal.length < 3) {
            milliseconds = (decimal + "000").substring(0, 3);
        } else {
            milliseconds = decimal.substring(0, 3);
            if (decimal.charAt(3) >= '5') {
                ++milliseconds;
            }
        }

        date.setMilliseconds(milliseconds);
    }

    var offset = date.getTimezoneOffset() * 60000;
    //offset in milli;

    // parse optional timezone
    if (pos + 5 < source.length &&
        (source.charAt(pos) == '+' || (source.charAt(pos) == '-'))) {
        if (!sforce.internal.isDigit(source.charAt(pos + 1)) ||
            !sforce.internal.isDigit(source.charAt(pos + 2)) ||
            source.charAt(pos + 3) != ':' ||
            !sforce.internal.isDigit(source.charAt(pos + 4)) ||
            !sforce.internal.isDigit(source.charAt(pos + 5))) {
            throw "Unable to parse dateTime";
        }
        var hours = (source.charAt(pos + 1) - '0') * 10 + source.charAt(pos + 2) - '0';
        var mins = (source.charAt(pos + 4) - '0') * 10 + source.charAt(pos + 5) - '0';
        var mseconds = (hours * 60 + mins) * 60 * 1000;

        // subtract milliseconds from current date to obtain GMT
        if (source.charAt(pos) == '+') {
            mseconds = -mseconds;
        }

        date = new Date(date.getTime() - offset + mseconds);
        pos += 6;
    }

    if (pos < source.length && source.charAt(pos) == 'Z') {
        pos++;
        date = new Date(date.getTime() - offset);
    }

    if (pos < source.length) {
        throw ("Unable to parse dateTime");
    }

    return date;
};


sforce.internal.isDigit = function (ch) {
    if (ch == '0' || ch == '1' || ch == '2' || ch == '3' || ch == '4' ||
        ch == '5' || ch == '6' || ch == '7' || ch == '8' || ch == '9') {
        return true;
    } else {
        return false;
    }
};
/** Xml */

sforce.Xml = function(name) {
};

sforce.Xml.prototype.toXml = function (sobjectNs, name, writer) {
    writer.writeStartElement(name, sobjectNs);
    if (this._xsiType) {
        writer.writeXsiType(this._xsiType);
    }
    for (var f in this) {
        if ("_name" == f || "_xsiType" == f) {
            //skip
        } else {
            var val = this[f];
            if (typeof val != "function") {
                // if (typeof val == "array") {
                if (Array.isArray(val)) {
                    for (var i=0; i<val.length; i++) {
                        this.writeValue(sobjectNs, writer, f, val[i]);
                    }
                } else {
                    this.writeValue(sobjectNs, writer, f, val);
                }
            }
        }
    }
    writer.writeEndElement(name, sobjectNs);
};


sforce.Xml.prototype.writeValue = function (sobjectNs, writer, name, val) {
    if (val === null) {
        writer.writeNameValueNode("fieldsToNull", name);
        return;
    }
    if (typeof(val) === "undefined") {
        //TODO:  throw "value for field " + name + " is undefined"; Bug: 100000000000Ufg
        return; //skip for now
    }
    if (val.toXml) {
        val.toXml(sobjectNs, name, writer);
    } else {
        writer.writeNameValueNode(name, val);
    }
};

sforce.Xml.prototype.get = function(name) {
    return this[name] ? this[name] : null;
};

sforce.Xml.prototype.set = function(name, value) {
    this[name] = value;
};

sforce.Xml.prototype.getArray = function(name) {
    var obj = this[name];
    if (obj) {
        if (obj.join) {
            return obj;
        } else {
            return [obj];
        }
    } else {
        return [];
    }
};

sforce.Xml.prototype.getBoolean = function(name) {
    return ("true" == this[name]) ? true : false;
};

sforce.Xml.prototype.getDate = function(name) {
    if (this[name]) {
        if (this[name].getFullYear) {
            return this[name];
        } else {
            return sforce.internal.stringToDate(this[name]);
        }
    } else {
        return null;
    }
};

sforce.Xml.prototype.getDateTime = function(name) {
    if (this[name]) {
        if (this[name].getFullYear) {
            return this[name];
        } else {
            return sforce.internal.stringToDateTime(this[name]);
        }
    } else {
        return null;
    }
};

sforce.Xml.prototype.getInt = function(name) {
    if (this[name]) {
        if (typeof this[name] === "number") {
            return this[name];
        } else {
            return parseInt(this[name], 10);
        }
    } else {
        throw "Unable to parse int field: " + name;
    }
};

sforce.Xml.prototype.getFloat = function(name) {
    if (this[name]) {
        if (typeof this[name] === "number") {
            return this[name];
        } else {
            return parseFloat(this[name]);
        }
    } else {
        throw "Unable to parse float field: " + name;
    }
};

sforce.Xml.prototype.getBase64Binary = function(name) {
    if (this[name]) {
        return sforce.Base64Binary.prototype.decode(this[name]);
    } else {
        throw "Unable to parse base64Binary field: " + name;
    }
};

sforce.Xml.prototype.toString = function() {
    var sb = new sforce.StringBuffer();
    sb.append("{");

    for (var f in this) {
        var field = this[f];

        if (!field) {
            sb.append(f).append(":").append("" + field);
        } else  if (typeof(field) == "object") {
            sb.append(f).append(":").append(field.toString());
        } else if (field.join) {
            sb.append(f).append(":").append("[");
            for (var i = 0; i < field.length; i++) {
                sb.append(field[i]);
                if (i < field.length - 1) {
                    sb.append(", ");
                }
            }
            sb.append("]");
        } else if (typeof(field) == "function") {
            continue;
        } else {
            sb.append(f).append(":").append("'" + field + "'");
        }
        sb.append(", ");
    }

    sb.append("}");
    return sb.toString();
};


/** Debug */


sforce.internal.Debug = function() {
    this.output = null;
    this.trace = false;
    this.apexTrace = false;
    this.win = null;
    this.traceQueue = [];
    this.quiet = false;

    this.open = function() {
        this.println("", "print");
    };

    this.println = function(s, type) {
        if (this.quiet) {
            return;
        }

        if (typeof(println) === "function") {
            println(s, type);
            return;
        }

        if (this.win === null || !this.win.document) {
            this.output = null;
            this.win = window.open((typeof window.UserContext != "undefined") ? UserContext.getUrl('/soap/ajax/37.0/debugshell.html') : '/soap/ajax/37.0/debugshell.html', '',
                    'width=800,height=400,toolbar=no,location=no,directories=no,alwaysRaised=yes,' +
                    'status=no,menubar=no,scrollbars=yes,copyhistory=yes,resizable=yes');
        }

        if (this.output === null) {
            this.findOutput();
        }

        if (this.output !== null) {
            if (sforce.debug.traceQueue.length > 0) {
                this.traceCallback();
            }
            this.win.println(s, type);
       } else {
            sforce.debug.traceQueue.push({message: s, type: type});
            setTimeout(sforce.debug.traceCallback, 1000);
        }
    };

    this.traceCallback = function() {
        sforce.debug.findOutput();

        if (sforce.debug.output === null) {
            setTimeout(sforce.debug.traceCallback, 1000);
            return;
        }

        for (var i=0; i<sforce.debug.traceQueue.length; i++) {
            var element = sforce.debug.traceQueue[i];
            sforce.debug.win.println(element.message, element.type);
        }
        sforce.debug.traceQueue = [];
    };

    this.findOutput = function() {
        if (this.output === null) {
            this.output = this.win.document.getElementById("output");
        }
        return this.output;
    };

    this.logXml = function(str) {
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = "<textarea cols=80 rows=5 wrap=hard>" + str + "</textarea>";
        this.println(str, "printxml");
    };

    this.log = function(str) {
        this.println(str, "print");
    };

    this.logApex = function(response) {
        var start = response.indexOf("<debugLog>");
        var end = response.indexOf("</debugLog>");
        if (start === -1)
            start = 0;
        else
            start = start + '<debugLog>'.length;
        if (end === -1) end = response.length;
        var msg = response.substring(start, end);

        this.println(msg, "printxml");
    };
};

sforce.debug = new sforce.internal.Debug();

/** Transport */

sforce.internal._connections = [];

sforce.internal.ConnectionHolder = function(connection, callback) {
    this.connection = connection;
    this.callback = callback;
    this.timedout = false;
};

sforce.Transport = function(url) {
    this.url = url;
    this.connection = null;

    this.newConnection = function() {
        try {
            this.connection = new ActiveXObject('Msxml2.XMLHTTP');
        } catch(e) {
            try {
                this.connection = new ActiveXObject('Microsoft.XMLHTTP');
            } catch(e) {
                this.connection = new XMLHttpRequest();
            }
        }

        return this.connection;
    };

    this.send = function (envelope, callback, async, timeout) {
        this.newConnection();
        if (async) {
            this.connection.onreadystatechange = this.httpConnectionCallback;
        }
        var holder = new sforce.internal.ConnectionHolder(this.connection, callback);
        sforce.internal._connections.push(holder);
        this.connection.open("POST", this.url, async);
        this.connection.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
        this.connection.setRequestHeader("SOAPAction", "\"\"");
        this.connection.setRequestHeader("Accept", "text/xml");
        this.connection.setRequestHeader("User-Agent", "SFAJAX 1.0");
        this.connection.send(envelope);
        if (async && typeof(timeout) !== "undefined") {
            this.setTimeoutOn(holder, timeout);
        }
        if (!async) {
            this.httpConnectionCallback();
        }
    };

    this.setTimeoutOn = function (holder, timeout) {
        function abortConnection() {
            if (holder.connection.readyState !== 4) {
                holder.timedout = true;
                holder.connection.abort();
            }
        }
        setTimeout(abortConnection, timeout);
    };

    this.httpConnectionCallback = function () {

        for (var i = 0; i < sforce.internal._connections.length; i++) {
            var holder = sforce.internal._connections[i];
            if (holder !== null) {
                if (holder.timedout) {
                    sforce.internal._connections[i] = null;
                    sforce.internal._connections.slice(i,1);
                    holder.callback.httpCallback("Remote invocation timed out", false);
                } else  if (holder.connection.readyState == 4) {
                    sforce.internal._connections[i] = null;
                    sforce.internal._connections.slice(i,1);
                    var success = holder.connection.status == 200;
                    if (sforce.debug.trace) {
                        sforce.debug.log("Response : status - " + holder.connection.status);
                        sforce.debug.logXml(holder.connection.responseText);
                    }
                    if (sforce.debug.apexTrace) {
                        sforce.debug.logApex(holder.connection.responseText);
                    }
                    if (holder.connection.responseXML && holder.connection.responseXML.documentElement) {
                        holder.callback.httpCallback(holder.connection.responseXML.documentElement, success);
                    } else {
                        holder.callback.httpCallback("Remote invocation failed, due to: " + holder.connection.responseText +
                                                     " status code: ", holder.connection.status);
                    }
                }
            }
        }
    };
};
/** XmlWriter */


sforce.XmlWriter = function() {
    this.buffer = new sforce.StringBuffer();
    this.namespaces = {};
    this.prefixCount = 0;
    this.writingStartElement = false;
};

sforce.XmlWriter.prototype.writeStartElement = function(name, namesp, prefix) {
    if (this.writingStartElement) {
        this.buffer.append(">");
    }
    this.buffer.append("<");
    var newns = false;
    if (namesp) {
        if (!this.namespaces[namesp] && this.namespaces[namesp] !== "") {
            newns = true;
        }
        if (!prefix) {
            prefix = this.getPrefix(namesp);
        }
        if (prefix !== null && prefix !== "") {
           this.buffer.append(prefix);
           this.buffer.append(":");
        }
    }

    this.buffer.append(name);
    if (newns === true) {
        this.writeNamespace(namesp, prefix);
    }
    this.writingStartElement = true;
};

sforce.XmlWriter.prototype.writeEndElement = function(name, namesp) {
    if (this.writingStartElement) {
        this.buffer.append("/>");
    } else {
        this.buffer.append("</");
        if (namesp) {
            var prefix = this.getPrefix(namesp);
            if (prefix && prefix !== "") {
              this.buffer.append(prefix);
              this.buffer.append(":");
            }
        }
        this.buffer.append(name);
        this.buffer.append(">");
    }
    this.writingStartElement = false;
};

sforce.XmlWriter.prototype.writeNamespace = function(namesp, prefix) {
    if (prefix && "" !== prefix) {
        this.namespaces[namesp] = prefix;
        this.buffer.append(" ");
        this.buffer.append("xmlns:");
        this.buffer.append(prefix);
    } else {
        this.namespaces[namesp] = "";
        this.buffer.append(" ");
        this.buffer.append("xmlns");
    }
    this.buffer.append("=\"");
    this.buffer.append(namesp);
    this.buffer.append("\"");
};

sforce.XmlWriter.prototype.writeText = function(text) {
    if (this.writingStartElement) {
        this.buffer.append(">");
        this.writingStartElement = false;
    } else {
        throw "Can only write text after a start element";
    }
    if (typeof text == 'string') {
        text = text.replace(/&/g, '\&amp;');
        text = text.replace(/</g, '&lt;');
        text = text.replace(/>/g, '&gt;');
    }

    this.buffer.append(text);
};

sforce.XmlWriter.prototype.writeXsiType = function(xsiType) {
    this.writeNamespace("http://www.w3.org/2001/XMLSchema-instance", "xsi");
    this.writeAttribute("xsi:type", xsiType);
};

sforce.XmlWriter.prototype.writeAttribute = function(name, value) {
    this.buffer.append(" " + name + "=\"" + value + "\"");
};

sforce.XmlWriter.prototype.getPrefix = function(namesp) {
    var prefix = this.namespaces[namesp];
    //sforce.debug.log("--------");
    //sforce.debug.log(namesp + ":" + (prefix === null ? "null":prefix) + ":");
    if (!prefix && prefix !== "") {
        prefix = "ns" + this.prefixCount;
        this.prefixCount++;
        this.namespaces[namesp] = prefix;
        return prefix;
    }
    return prefix;
};

sforce.XmlWriter.prototype.toString = function() {
    return this.buffer.toString();
};

/** soap writer*/
sforce.XmlWriter.prototype.soapNS = "http://schemas.xmlsoap.org/soap/envelope/";

sforce.XmlWriter.prototype.startEnvelope = function() {
    this.writeStartElement("Envelope", this.soapNS, "se");
};

sforce.XmlWriter.prototype.endEnvelope = function() {
    this.writeEndElement("Envelope", this.soapNS);
};

sforce.XmlWriter.prototype.startHeader = function() {
    this.writeStartElement("Header", this.soapNS, "se");
};

sforce.XmlWriter.prototype.endHeader = function() {
    this.writeEndElement("Header", this.soapNS);
};

sforce.XmlWriter.prototype.startBody = function() {
    this.writeStartElement("Body", this.soapNS, "se");
};

sforce.XmlWriter.prototype.endBody = function() {
    this.writeEndElement("Body", this.soapNS);
};

sforce.XmlWriter.prototype.writeNameValueNode = function(name, value) {
    if (value === null) {
        this.writeStartElement(name);
        this.writeNamespace("http://www.w3.org/2001/XMLSchema-instance", "xsi");
        this.writeAttribute("xsi:nill", "true");
        this.writeEndElement(name);
        return;
    }

    if (value.toUTCString) {
        value = sforce.internal.dateTimeToString(value);
    }
    if (typeof value == "boolean") {
        // boolean 'false' values get joined in string buffer,
        // so convert to strings:
        value = value ? "true" : "false";
    }

    if (value && value.join) {
        for (var i=0; i<value.length; i++) {
            this.writeStartElement(name);
            this.writeText(value[i]);
            this.writeEndElement(name);
        }
    } else {
        this.writeStartElement(name);
        this.writeText(value);
        this.writeEndElement(name);
    }
};

/** XmlReader */

sforce.XmlReader = function(root) {
    this.envelope = root;
};

sforce.XmlReader.prototype.getEnvelope = function() {
    if (this.isTag("Envelope", this.envelope)) {
        return this.envelope;
    }
    throw "Unable to find soap envelope, but found " + this.envelope.nodeName;
};

sforce.XmlReader.prototype.getBody = function() {
    return this.getChild("Body", this.envelope);
};

sforce.XmlReader.prototype.getHeader = function() {
    return this.getChild("Header", this.envelope);
};

sforce.XmlReader.prototype.getChild = function(name, node) {
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == 1 && this.isTag(name, children[i])) {
            return children[i];
        }
    }
    return null;
};

sforce.XmlReader.prototype.getFirstElement = function(node) {
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == 1) {
            return children[i];
        }
    }
    return null;
};

sforce.XmlReader.prototype.isTag = function(name, node) {
    var ns = node.nodeName.split(":");
    if (ns.length == 2 && ns[1] == name) {
        return true;
    }
    if (ns.length == 1 && ns[0] == name) {
        return true;
    }
    return false;
};

sforce.XmlReader.prototype.isNameValueNode = function(node) {
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType != 3) {
            return false;
        }
    }

    return true;
};

sforce.XmlReader.prototype.getTextValue = function(node) {
    if (node.nodeType == 3) {
        return node.nodeValue;
    }
    //todo: fix the hardcoded xsi prefix
    var xsiNil = node.getAttribute("xsi:nil");
    if (xsiNil == "true") {
        return null;
    }
    var sb = "";
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == 3) {
            sb += children[i].nodeValue;
        } else {
            throw "Not a simple name value node";
        }
    }
    return sb;
};

//todo: optimize
/*
sforce.XmlReader.prototype.toXmlObject2 = function(node) {
    var children = node.childNodes;
    var obj = new sforce.Xml();
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType != 1) continue;
        var name = child.nodeName;
        var index = name.indexOf(":");
        name = (index == -1) ? name : name.substring(index + 1);
        var value;
        if (this.isNameValueNode(child)) {
            value = this.getTextValue(child);
        } else {
            value = this.toXmlObject(child);
        }
        this.addToObject(obj, name, value);
    }
    return obj;
}
*/


sforce.XmlReader.prototype.toXmlObject = function(n) {
    //todo: fix the hardcoded xsi prefix
    var xsiNil = n.getAttribute("xsi:nil");
    if (xsiNil == "true") {
        return null;
    }

    var top = new sforce.Xml();
    var stack = [];
    stack.push({node: n, obj: top});

    while (stack.length > 0) {
        var st = stack.shift();

        for (var child = st.node.firstChild; child !== null; child = child.nextSibling) {
            if (child.nodeType != 1) {
                continue;
            }
            var name = child.nodeName;
            var index = name.indexOf(":");
            name = (index == -1) ? name : name.substring(index + 1);
            var value;

            var isNameValue = true;
            var sb = "";
            for (var tc = child.firstChild; tc !== null; tc = tc.nextSibling) {
                if (tc.nodeType != 3) {
                    isNameValue = false;
                    break;
                } else {
                    sb += tc.nodeValue;
                }
            }

            if (isNameValue) {
                if (child.getAttribute("xsi:nil") == "true") {
                    value = null;
                } else {
                    value = sb;
                }
            } else {
                value = new sforce.Xml();
                stack.push({node: child, obj: value});
            }
            if (!st.obj[name]) {
                st.obj[name] = value;
            } else {
                if (st.obj[name].push) {
                    st.obj[name].push(value);
                } else {
                    var old = st.obj[name];
                    if (name === "Id" && old === value) {
                        //skip, special case for dup Id in sobject
                    } else {
                        st.obj[name] = [];
                        st.obj[name].push(old);
                        st.obj[name].push(value);
                    }
                }
            }
        }
    }
    return top;
};


/** SoapTransport */

sforce.SoapTransport = function() {
    this.connectionCallback = null;
    this.result = null;
    this.fault = null;
    this.isAsync = true;
    this.isArray = false;
};

sforce.SoapTransport.prototype.onFailure = function(res, writer) {
    var error = "ERROR: ........... ";
    alert(error + res);
    this.result = null;
};

sforce.SoapTransport.prototype.send = function(url, writer, isArray, connectionCallback) {
    this.isArray = isArray;
    var transport = new sforce.Transport(url);
    this.isAsync = connectionCallback ? true : false;
    if (this.isAsync) {
        this.connectionCallback = connectionCallback;
        transport.send(writer.toString(), this, this.isAsync, connectionCallback.timeout);
    } else {
        transport.send(writer.toString(), this, this.isAsync);
        if (this.fault !== null) {
            throw this.fault;
        }
        return this.result;
    }
};

sforce.SoapTransport.prototype.httpCallback = function(response, success) {
    try {
        if (success === true) {
            var reader = new sforce.XmlReader(response);
            var envelope = reader.getEnvelope();
            var body = reader.getBody();
            var operation = reader.getFirstElement(body);
            if (operation === null) {
                throw "Unable to find operation response element";
            }
            var resultArray = [];
            var children = operation.childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i].nodeType != 1) {
                    continue;
                }
                if (reader.isNameValueNode(children[i])) {
                    resultArray.push(reader.getTextValue(children[i]));
                } else {
                    resultArray.push(reader.toXmlObject(children[i]));
                }
            }

            if (this.isArray) {
                this.result = resultArray;
            } else {
                if (resultArray.length > 1) {
                    throw "Found more than one response: " + resultArray;
                }
                this.result = resultArray[0];
            }

            if (this.isAsync) {
                try {
                    this.beforeCallback();
                    if (typeof this.connectionCallback == "function") {
                        this.connectionCallback(this.result);
                    } else {
                        if (this.connectionCallback.onSuccess) {
                            this.connectionCallback.onSuccess(this.result, this.connectionCallback.source);
                        } else {
                            throw "Unable to find onSuccess method in the callback object";
                        }
                    }
                } finally {
                    this.afterCallback();
                }
            }
        } else {
            if (typeof(response.nodeName) !== "undefined") {
                var reader2 = new sforce.XmlReader(response);
                var envelope2 = reader2.getEnvelope();
                var body2 = reader2.getBody();
                var soapfaultEl = reader2.getFirstElement(body2);
                var soapfault = reader2.toXmlObject(soapfaultEl);
                this.sendFault(soapfault);
            } else {
                this.sendFault(response);
            }
        }
    } catch(fault) {
        this.sendFault(fault);
    }
};


sforce.SoapTransport.prototype.sendFault = function(fault) {
    if (this.isAsync) {
        if (this.connectionCallback.onFailure) {
            try {
                this.beforeCallback();
                this.connectionCallback.onFailure(fault, this.connectionCallback.source);
            } finally {
                this.afterCallback();
            }
        } else {
            this.onFailure(fault);
        }
    } else {
        this.fault = fault;
    }
};

sforce.SoapTransport.prototype.beforeCallback = function () {};

sforce.SoapTransport.prototype.afterCallback = function () {};

/** SObject */


sforce.SObject = function(type) {
    this.type = type;
};

sforce.SObject.prototype = new sforce.Xml("sObjects");


/** LeadConvert */


sforce.LeadConvert = function() {
};

sforce.LeadConvert.prototype = new sforce.Xml("leadConverts");

/** MergeRequest */


sforce.MergeRequest = function() {
};

sforce.MergeRequest.prototype = new sforce.Xml("request");

/** DescribeSoqlListViewsRequest - see describeSoqlListViews() */
sforce.DescribeSoqlListViewsRequest  = function() {
};
sforce.DescribeSoqlListViewsRequest.prototype = new sforce.Xml("request");

/** DescribeSoqlListViewParams - see describeSoqlListViews() */
sforce.DescribeSoqlListViewParams = function() {
};
sforce.DescribeSoqlListViewParams.prototype = new sforce.Xml("listViewParams");



/** QuickAction */


sforce.QuickAction = function() {
};

sforce.QuickAction.prototype = new sforce.Xml("quickActions");

/** MatchOptions */


sforce.MatchOptions = function() {
};

sforce.MatchOptions.prototype = new sforce.Xml("matchOptions");

/** Connection */

sforce.Connection = function() {
    this.sessionId = null;
    this.updateMru = null;
    this.allowFieldTruncation = null;
    this.disableFeedTracking = null;
    this.streamingEnabled = null;
    this.allOrNone = null;
    this.client = null;
    this.defaultNamespace = null;
    this.batchSize = null;
    this.loginScopeHeader = null;
    this.emailHeader = null;
    this.assignmentRuleHeader = null;
    this.duplicateRuleHeader = null;
    this.transferToUserId = null;
    this.debuggingHeader = null;
    this.serverUrl = (typeof window.UserContext != "undefined") ? UserContext.getUrl("/services/Soap/u/37.0") : "/services/Soap/u/37.0";
};


/** internal methods */

sforce.internal.Parameter = function (n, v, a) {
    this.name = n;
    this.value = v;
    this.isArray = a;
};

sforce.Connection.prototype.sforceNs = "urn:partner.soap.sforce.com";
sforce.Connection.prototype.sobjectNs = "sobject.partner.soap.sforce.com";

sforce.Connection.prototype.writeOne = function (writer, name, value, sobjectNs) {
    if (value === null) {
        writer.writeNameValueNode(name, null);
    } else if (value.toXml) {
        value.toXml(sobjectNs, name, writer);
    } else {
        writer.writeNameValueNode(name, value);
    }
};

sforce.Connection.prototype.init = function(sessionId, serverUrl) {
    this.sessionId = sessionId;
    this.serverUrl = serverUrl;
};

sforce.Connection.prototype.login = function (username, password) {
    var arg1 = new sforce.internal.Parameter("username", username, false);
    var arg2 = new sforce.internal.Parameter("password", password, false);
    var result = this.invoke("login", [arg1, arg2], false, null);
    this.sessionId = result.sessionId;
    return result;
};

sforce.Connection.prototype.describeSObject = function(type, callback) {
    var arg = new sforce.internal.Parameter("sObjectType", type, false);
    return this.invoke("describeSObject", [arg], false, callback);
};

sforce.Connection.prototype.describeSObjects = function(types, callback) {
    var arg = new sforce.internal.Parameter("sObjectType", types, true);
    return this.invoke("describeSObjects", [arg], true, callback);
};

sforce.Connection.prototype.describeSearchLayouts = function(type, callback) {
    var arg = new sforce.internal.Parameter("sObjectType", type, true);
    return this.invoke("describeSearchLayouts", [arg], true, callback);
};

sforce.Connection.prototype.describeListViews = function(type, callback) {
    var arg = new sforce.internal.Parameter("sObjectType", type, true);
    return this.invoke("describeListViews", [arg], true, callback);
};

sforce.Connection.prototype.describeSoqlListViews = function(name, type, callback) {
    // this interface is only for a single list
    // build up a request for the user - easier than making caller do it
	var rp = new sforce.DescribeSoqlListViewParams();
	rp.developerNameOrId = name;
	rp.sobjectType = type;
	var describeRequest = new sforce.DescribeSoqlListViewsRequest();
	describeRequest.listViewParams = [ rp ];

    var arg1 = new sforce.internal.Parameter("request", describeRequest, false);
    return this.invoke("describeSoqlListViews", [arg1], false, callback);
};

sforce.Connection.prototype.describeGlobal = function(callback) {
    return this.invoke("describeGlobal", [], false, callback);
};

sforce.Connection.prototype.describeLayout = function(type, layoutName, recordTypes, callback) {
    var arg1 = new sforce.internal.Parameter("sObjectType", type, false);
    if (!layoutName) {
        layoutName = null;
    }
    var arg2 = new sforce.internal.Parameter("layoutName", layoutName, false);
    if (!recordTypes) {
        recordTypes = [];
    }
    var arg3 = new sforce.internal.Parameter("recordTypeIds", recordTypes, true);
    return this.invoke("describeLayout", [arg1, arg2, arg3], false, callback);
};

sforce.Connection.prototype.describeAvailableQuickActions = function(parentType, callback) {
    var arg = new sforce.internal.Parameter("parentType", parentType, false);
    return this.invoke("describeAvailableQuickActions", [arg], true, callback);
};

sforce.Connection.prototype.describeQuickActions = function(quickActionNames, callback) {
    var arg = new sforce.internal.Parameter("quickActionNames", quickActionNames, true);
    return this.invoke("describeQuickActions", [arg], true, callback);
};

sforce.Connection.prototype.performQuickActions = function(quickActions, callback) {
    var arg = new sforce.internal.Parameter("quickActions", quickActions, true);
    return this.invoke("performQuickActions", [arg], true, callback);
};

sforce.Connection.prototype.describeCompactLayouts = function(type, recordTypes, callback) {
    var arg = new sforce.internal.Parameter("sObjectType", type, false);
    if (!recordTypes) {
        recordTypes = [];
    }
    var arg2 = new sforce.internal.Parameter("recordTypeIds", recordTypes, true);
    return this.invoke("describeCompactLayouts", [arg, arg2], false, callback);
};

sforce.Connection.prototype.describePathAssistants = function(type, picklistValue, recordTypes, callback) {
    var arg = new sforce.internal.Parameter("sObjectType", type, false);
    if (!picklistValue) {
        picklistValue = null;
    }
    var arg2 = new sforce.internal.Parameter("picklistValue", picklistValue, false);
    if (!recordTypes) {
        recordTypes = [];
    }
    var arg3 = new sforce.internal.Parameter("recordTypeIds", recordTypes, true);
    return this.invoke("describePathAssistants", [arg, arg2, arg3], false, callback);
};

sforce.Connection.prototype.describePrimaryCompactLayouts = function(sObjectTypes, callback) {
    var arg = new sforce.internal.Parameter("sObjectTypes", sObjectTypes, true);
    return this.invoke("describePrimaryCompactLayouts", [arg], true, callback);
};

sforce.Connection.prototype.describeApprovalLayout = function(type, approvalProcessNames, callback) {
    var arg1 = new sforce.internal.Parameter("sObjectType", type, false);
    if (!approvalProcessNames) {
    	approvalProcessNames = [];
    }
    var arg2 = new sforce.internal.Parameter("approvalProcessNames", approvalProcessNames, true);
    return this.invoke("describeApprovalLayout", [arg1, arg2], false, callback);
};

sforce.Connection.prototype.describeSObjectListViews = function(type, recentlyViewed, callback) {
    var arg1 = new sforce.internal.Parameter("sObjectType", type, false);
    var arg2 = new sforce.internal.Parameter("recentlyViewed", recentlyViewed, false);
    var arg3 = new sforce.internal.Parameter("isSoqlCompatible", isSoqlCompatible, false);
    var arg4 = new sforce.internal.Parameter("limit", limit, false);
    var arg5 = new sforce.internal.Parameter("offset", offset, false);
    return this.invoke("describeSObjectListViews", [arg1, arg2, arg3, arg4, arg5], true, callback);
};

sforce.Connection.prototype.describeTabs = function(uiType, callback) {
	var args = [];
	if (uiType) {
		// As of 200, the internal interface supports specifying a UiType
		var arg1 = new sforce.internal.Parameter("uiType", uiType, false);
		args = [arg1];
	}
	return this.invoke("describeTabs", args, true, callback);
};

sforce.Connection.prototype.describeAllTabs = function(callback) {
	return this.invoke("describeAllTabs", [], true, callback);
};

sforce.Connection.prototype.describeAppMenu = function(appMenuType, networkId, callback) {
	var arg1 = new sforce.internal.Parameter("appMenuType", appMenuType, false);
	var arg2 = new sforce.internal.Parameter("networkId", networkId, false);
    return this.invoke("describeAppMenu", [arg1, arg2], true, callback);
};

sforce.Connection.prototype.describeFlexiPages = function(flexipageDevName, callback) {
	var arg1 = new sforce.internal.Parameter("FlexiPage", flexipageDevName, false);
	return this.invoke("describeFlexiPages", [arg1], true, callback);
};

sforce.Connection.prototype.describeTheme = function(callback) {
    return this.invoke("describeTheme", [], true, callback);
};

sforce.Connection.prototype.describeGlobalTheme = function(callback) {
    return this.invoke("describeGlobalTheme", [], true, callback);
};

sforce.Connection.prototype.describeSoftphoneLayout = function(callback) {
    return this.invoke("describeSoftphoneLayout", [], false, callback);
};

sforce.Connection.prototype.describeMiniLayout = function (type, recordTypeIds, callback) {
    var arg1 = new sforce.internal.Parameter("sObjectType", type, false);
    var arg2 = new sforce.internal.Parameter("recordTypeIds", recordTypeIds, true);
    return this.invoke("describeMiniLayout", [arg1, arg2], false, callback);
};

sforce.Connection.prototype.describeSearchScopeOrder = function(callback) {
     return this.invoke("describeSearchScopeOrder", [], true, callback);
};

sforce.Connection.prototype.create = function (sobjects, callback) {
    var arg = new sforce.internal.Parameter("sObjects", sobjects, true);
    return this.invoke("create", [arg], true, callback);
};

sforce.Connection.prototype.update = function (sobjects, callback) {
    var arg = new sforce.internal.Parameter("sObjects", sobjects, true);
    return this.invoke("update", [arg], true, callback);
};

sforce.Connection.prototype.upsert = function (externalIDFieldName, sobjects, callback) {
    var arg1 = new sforce.internal.Parameter("externalIDFieldName", externalIDFieldName, false);
    var arg2 = new sforce.internal.Parameter("sObjects", sobjects, true);
    return this.invoke("upsert", [arg1, arg2], true, callback);
};

sforce.Connection.prototype.deleteIds = function (ids, callback) {
    var arg = new sforce.internal.Parameter("ids", ids, true);
    return this.invoke("delete", [arg], true, callback);
};

sforce.Connection.prototype.impersonateUser = function (ids, callback) {
    var arg = new sforce.internal.Parameter("ids", ids, true);
    return this.invoke("impersonateUser", [arg], true, callback);
};
sforce.Connection.prototype.query = function(queryString, callback) {
    var arg = new sforce.internal.Parameter("queryString", queryString, false);
    return this.invoke("query", [arg], false, callback);
};

sforce.Connection.prototype.queryAll = function(queryString, callback) {
    var arg = new sforce.internal.Parameter("queryString", queryString, false);
    return this.invoke("queryAll", [arg], false, callback);
};

sforce.Connection.prototype.queryMore = function(queryLocator, callback) {
    var arg = new sforce.internal.Parameter("queryLocator", queryLocator, false);
    return this.invoke("queryMore", [arg], false, callback);
};

sforce.Connection.prototype.retrieve = function(fieldList, sObjectType, ids, callback) {
    var arg1 = new sforce.internal.Parameter("fieldList", fieldList, false);
    var arg2 = new sforce.internal.Parameter("sObjectType", sObjectType, false);
    var arg3 = new sforce.internal.Parameter("ids", ids, true);
    return this.invoke("retrieve", [arg1, arg2, arg3], true, callback);
};

sforce.Connection.prototype.match = function(sobjects, matchOptions, callback) {
    var arg1 = new sforce.internal.Parameter("sObjects", sobjects, true);
    var arg2 = new sforce.internal.Parameter("matchOptions", matchOptions, false);
    return this.invoke("match", [arg1, arg2], false, callback);
};

sforce.Connection.prototype.getAccessInfo = function(callback) {
    return this.invoke("getAccessInfo", [], false, callback);
};

sforce.Connection.prototype.getUserInfo = function(callback) {
    return this.invoke("getUserInfo", [], false, callback);
};

sforce.Connection.prototype.resetPassword = function(userId, callback) {
    var arg1 = new sforce.internal.Parameter("userId", userId, false);
    return this.invoke("resetPassword", [arg1], false, callback);
};

sforce.Connection.prototype.setPassword = function(userId, password, callback) {
    var arg1 = new sforce.internal.Parameter("userId", userId, false);
    var arg2 = new sforce.internal.Parameter("password", password, false);
    return this.invoke("setPassword", [arg1, arg2], false, callback);
};

sforce.Connection.prototype.search = function(searchString, callback) {
    var arg1 = new sforce.internal.Parameter("searchString", searchString, false);
    return this.invoke("search", [arg1], false, callback);
};

sforce.Connection.prototype.getDeleted = function(sObjectType, startDate, endDate, callback) {
    var arg1 = new sforce.internal.Parameter("sObjectType", sObjectType, false);
    var arg2 = new sforce.internal.Parameter("startDate", startDate, false);
    var arg3 = new sforce.internal.Parameter("endDate", endDate, false);
    return this.invoke("getDeleted", [arg1, arg2, arg3], false, callback);
};

sforce.Connection.prototype.getUpdated = function(sObjectType, startDate, endDate, callback) {
    var arg1 = new sforce.internal.Parameter("sObjectType", sObjectType, false);
    var arg2 = new sforce.internal.Parameter("startDate", startDate, false);
    var arg3 = new sforce.internal.Parameter("endDate", endDate, false);
    return this.invoke("getUpdated", [arg1, arg2, arg3], false, callback);
};


sforce.Connection.prototype.getServerTimestamp = function(callback) {
    return this.invoke("getServerTimestamp", [], false, callback);
};

sforce.Connection.prototype.convertLead = function(leadConverts, callback) {
    var arg1 = new sforce.internal.Parameter("leadConverts", leadConverts, true);
    return this.invoke("convertLead", [arg1], true, callback);
};

sforce.Connection.prototype.merge = function(mergeRequest, callback) {
    var arg1 = new sforce.internal.Parameter("request", mergeRequest, true);
    return this.invoke("merge", [arg1], true, callback);
};

sforce.Connection.prototype.undelete = function(ids, callback) {
    var arg1 = new sforce.internal.Parameter("ids", ids, true);
    return this.invoke("undelete", [arg1], true, callback);
};

sforce.Connection.prototype.process = function(actions, callback) {
    var arg1 = new sforce.internal.Parameter("actions", actions, true);
    return this.invoke("process", [arg1], true, callback);
};

sforce.Connection.prototype.sendEmail = function(messages, callback) {
    var arg1 = new sforce.internal.Parameter("messages", messages, true);
    return this.invoke("sendEmail", [arg1], true, callback);
};

sforce.Connection.prototype.emptyRecycleBin = function(ids, callback) {
    var arg1 = new sforce.internal.Parameter("ids", ids, true);
    return this.invoke("emptyRecycleBin", [arg1], true, callback);
};

sforce.Connection.prototype.invalidateSessions = function(sessionIds, callback) {
    var arg = new sforce.internal.Parameter("sessionIds", sessionIds, true);
    return this.invoke("invalidateSessions", [arg], true, callback);
};

sforce.Connection.prototype.logout = function(callback) {
    return this.invoke("logout", [], true, callback);
};

sforce.Connection.prototype.remoteFunction = function(args) {
    if (!args.url) {
        throw "url not defined";
    }
    if (!args.onSuccess) {
        throw "onSuccess method not defined";
    }

    if (!args.method) {
        args.method = "GET";
    }
    if (!args.mimeType) {
        args.mimeType = "text/plain";
    }

    if (typeof(args.async) == 'undefined') {
        args.async = true;
    }

    if (typeof(args.cache) == 'undefined') {
        args.cache = false;
    }

    if (!(args.mimeType == "text/plain" ||
          args.mimeType == "text/xml")) {
        throw "Unknown mime type " + args.mimeType;
    }

    if (sforce.debug.trace) {
        sforce.debug.log("Open connection to ... " + args.url);
    }

    var request = new sforce.Transport().newConnection();
    var proxyUrl = (typeof window.UserContext != "undefined") ? UserContext.getUrl("/services/proxy") : "/services/proxy";
    if (args.cache) {
        proxyUrl = proxyUrl + "?end-point-url=" + args.url;
    } else {
        proxyUrl = proxyUrl + "?no-cache=" + new Date().getTime();
    }
    request.open(args.method, proxyUrl, args.async);

    if (args.requestHeaders) {
        for (var k in args.requestHeaders) {
            if (typeof args.requestHeaders[k] != "function") {
                request.setRequestHeader(k, args.requestHeaders[k]);
            }
        }
    }

    request.setRequestHeader("SalesforceProxy-Endpoint", args.url);
    request.setRequestHeader("SalesforceProxy-SID", this.sessionId);

    if (args.async) {
        request.onreadystatechange = _remoteFunctionCallback;
    }

    if (sforce.debug.trace) {
        sforce.debug.log("Sending ...");
    }

    if (args.requestData) {
        request.send(args.requestData);
    } else {
        request.send(null);
    }

    if (sforce.debug.trace) {
        sforce.debug.log("Done Sending ...");
    }

    if (!args.async) {
        _remoteFunctionCallback();
    }

    function _remoteFunctionCallback() {
        if (sforce.debug.trace) {
            sforce.debug.log("callback called ...");
        }
        if (request.readyState == 4) {
            if (request.status == 200) {
                if (args.mimeType == "text/plain") {
                    args.onSuccess(request.responseText, request);
                } else if (args.mimeType == "text/xml") {
                    if (!request.responseXML || !request.responseXML.documentElement) {
                        throw "Response not text/xml mime type: " + request.responseText;
                    }
                    args.onSuccess(request.responseXML.documentElement, request);
                } else {
                    throw "unsupported mime type: " + args.mimeType;
                }
            } else {
                if (args.onFailure) {
                    args.onFailure(request.responseText, request);
                } else {
                    sforce.debug.log(request.responseText);
                }
            }
        }
    }
};


sforce.Connection.prototype.writeHeader = function(writer, headerNs) {
    writer.startHeader();

    writer.writeNamespace(headerNs, "sfns");

    if (this.sessionId !== null) {
        writer.writeStartElement("SessionHeader", headerNs);
        writer.writeNameValueNode("sessionId", this.sessionId);
        writer.writeEndElement("SessionHeader", headerNs);
    }
    if (typeof(this.organizationId) !== "undefined") {
        throw "Use sforce.connection.loginScopeHeader.organizationId instead of sforce.connection.organizationId";
    }
    if (this.loginScopeHeader !== null) {
        writer.writeStartElement("LoginScopeHeader", headerNs);
        if (this.loginScopeHeader.organizationId !== null) {
            writer.writeNameValueNode("organizationId", this.loginScopeHeader.organizationId);
        }
        if (this.loginScopeHeader.portalId !== null) {
            writer.writeNameValueNode("portalId", this.loginScopeHeader.portalId);
        }
        writer.writeEndElement("LoginScopeHeader", headerNs);
    }
    if (this.client !== null || this.defaultNamespace !== null) {
        writer.writeStartElement("CallOptions", headerNs);
        if (this.client !== null) {
            writer.writeNameValueNode("client", this.client);
        }
        if (this.defaultNamespace !== null) {
            writer.writeNameValueNode("defaultNamespace", this.defaultNamespace);
         }
        writer.writeEndElement("CallOptions", headerNs);
    }
    if (this.batchSize !== null) {
        writer.writeStartElement("QueryOptions", headerNs);
        writer.writeNameValueNode("batchSize", this.batchSize);
        writer.writeEndElement("QueryOptions", headerNs);
    }
    if (this.allowFieldTruncation !== null) {
        writer.writeStartElement("AllowFieldTruncationHeader", headerNs);
        writer.writeNameValueNode("allowFieldTruncation", this.allowFieldTruncation);
        writer.writeEndElement("AllowFieldTruncationHeader", headerNs);
    }
    if (this.disableFeedTracking !== null) {
        writer.writeStartElement("DisableFeedTrackingHeader", headerNs);
        writer.writeNameValueNode("disableFeedTracking", this.disableFeedTracking);
        writer.writeEndElement("DisableFeedTrackingHeader", headerNs);
    }
    if (this.streamingEnabled !== null) {
        writer.writeStartElement("StreamingEnabledHeader", headerNs);
        writer.writeNameValueNode("StreamingEnabled", this.streamingEnabled);
        writer.writeEndElement("StreamingEnabledHeader", headerNs);
    }
    if (this.allOrNone !== null) {
        writer.writeStartElement("AllOrNoneHeader", headerNs);
        writer.writeNameValueNode("allOrNone", this.allOrNone);
        writer.writeEndElement("AllOrNoneHeader", headerNs);
    }
    if (this.updateMru !== null) {
        writer.writeStartElement("MruHeader", headerNs);
        writer.writeNameValueNode("updateMru", this.updateMru);
        writer.writeEndElement("MruHeader", headerNs);
    }
    if (this.emailHeader !== null) {
        writer.writeStartElement("EmailHeader", headerNs);
        if (this.emailHeader.triggerAutoResponseEmail) {
            writer.writeNameValueNode("triggerAutoResponseEmail", this.emailHeader.triggerAutoResponseEmail);
        }
        if (this.emailHeader.triggerOtherEmail) {
            writer.writeNameValueNode("triggerOtherEmail", this.emailHeader.triggerOtherEmail);
        }
        if (this.emailHeader.triggerUserEmail) {
            writer.writeNameValueNode("triggerUserEmail", this.emailHeader.triggerUserEmail);
        }
        writer.writeEndElement("EmailHeader", headerNs);
    }
    if (this.assignmentRuleHeader !== null) {
        writer.writeStartElement("AssignmentRuleHeader", headerNs);
        if (this.assignmentRuleHeader.assignmentRuleId) {
            writer.writeNameValueNode("assignmentRuleId", this.assignmentRuleHeader.assignmentRuleId);
        }
        if (this.assignmentRuleHeader.useDefaultRule) {
            writer.writeNameValueNode("useDefaultRule", this.assignmentRuleHeader.useDefaultRule);
        }
        writer.writeEndElement("AssignmentRuleHeader", headerNs);
    }
    if (this.transferToUserId !== null) {
        writer.writeStartElement("UserTerritoryDeleteHeader", headerNs);
        writer.writeNameValueNode("transferToUserId", this.transferToUserId);
        writer.writeEndElement("UserTerritoryDeleteHeader", headerNs);
    }
    if (this.duplicateRuleHeader !== null) {
        writer.writeStartElement("DuplicateRuleHeader", headerNs);
        if (this.duplicateRuleHeader.allowSave) {
            writer.writeNameValueNode("allowSave", this.duplicateRuleHeader.allowSave);
        }
        if (this.duplicateRuleHeader.includeRecordDetails) {
            writer.writeNameValueNode("includeRecordDetails", this.duplicateRuleHeader.includeRecordDetails);
        }
        if (this.duplicateRuleHeader.runAsCurrentUser) {
            writer.writeNameValueNode("runAsCurrentUser", this.duplicateRuleHeader.runAsCurrentUser);
        }
        writer.writeEndElement("DuplicateRuleHeader", headerNs);
    }
    if (this.debuggingHeader !== null) {
        writer.writeStartElement("DebuggingHeader", headerNs);
        // Write out old style if specified
        if (this.debuggingHeader.debugLevel) {
            writer.writeNameValueNode("debugLevel", this.debuggingHeader.debugLevel);
        }
        // Write out the new style debugging categories and levels
        if (this.debuggingHeader.debugCategories) {
            var categories = this.debuggingHeader.debugCategories;
            for (var i = 0; i < categories.length; i++) {
                var catAndLevel = categories[i].split(",");

                if (catAndLevel.length == 2) {
                    writer.writeStartElement("categories");
                    writer.writeNameValueNode("category", catAndLevel[0]);
                    writer.writeNameValueNode("level", catAndLevel[1]);
                    writer.writeEndElement("categories");
                }
            }
        }
        writer.writeEndElement("DebuggingHeader", headerNs);
    }

    writer.endHeader();
};

sforce.Connection.prototype.namespaceMap = [
{ns:sforce.Connection.prototype.sforceNs, prefix:null},
{ns:sforce.Connection.prototype.sobjectNs, prefix:"ns1"}
        ];

sforce.Connection.prototype.invoke = function(method, args, isArray, callback) {
    return this._invoke(method, args, isArray, callback, this.namespaceMap, this.serverUrl, this.sforceNs, this.sobjectNs);
};

sforce.Connection.prototype._invoke = function(method, args, isArray, callback, namespaces, url, headerNs, sobjectNs) {
    if (callback) {
        if (typeof(callback) == "function") {
        } else {
            if (!callback.onSuccess) {
                throw "onSuccess not defined in the callback";
            }
            if (!callback.onFailure) {
                throw "onFailure not defined in the callback";
            }
        }
    }

    var writer = new sforce.XmlWriter();
    writer.startEnvelope();
    this.writeHeader(writer, headerNs);
    writer.startBody();
    writer.writeStartElement(method);

    for (var i = 0; i<namespaces.length; i++) {
        writer.writeNamespace(namespaces[i].ns, namespaces[i].prefix);
    }

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (typeof(arg.value) === "undefined") {
            throw "arg " + i + " '" + arg.name + "' not specified";
        }
        if (arg.value !== null) {
            if (arg.isArray && !arg.value.push) {
                throw "arg " + i + " '" + arg.name + "' is an array. But passed in value is not an array";
            }
            if (!arg.isArray && arg.value.push) {
                throw "arg " + i + " '" + arg.name + "' is not an array. But passed in value is an array";
            }
        }
        if (arg.value === null) {
            this.writeOne(writer, arg.name, null, sobjectNs);
        } else if (arg.value.push) { //this is an array
            for (var j = 0; j < arg.value.length; j++) {
                var obj = arg.value[j];
                if (!obj) {
                    throw "Array element at " + j + " is null.";
                }
                this.writeOne(writer, arg.name, obj, sobjectNs);
            }
        } else {
            this.writeOne(writer, arg.name, arg.value, sobjectNs);
        }
    }
    writer.writeEndElement(method);
    writer.endBody();
    writer.endEnvelope();
    if (sforce.debug.trace) {
        sforce.debug.log("Request: server- " + url);
        sforce.debug.logXml(writer.toString());
    }
    var transport = new sforce.SoapTransport();
    return transport.send(url, writer, isArray, callback);
};


/* QueryResultIterator */

sforce.QueryResultIterator = function(queryResult) {
    this.queryResult = queryResult;
    this.index = 0;
    this.records = this.queryResult.getArray("records");
};

sforce.QueryResultIterator.prototype.hasNext = function() {
    if (this.records.length > this.index) {
        return true;
    }
    if (this.queryResult.queryLocator !== null) {
        this.queryResult = sforce.connection.queryMore(this.queryResult.queryLocator);
        this.records = this.queryResult.getArray("records");
        this.index = 0;
    }
    if (this.records.length > this.index) {
        return true;
    } else {
        return false;
    }
};

sforce.QueryResultIterator.prototype.next = function() {
    if (this.records.length > this.index) {
        var result = this.records[this.index];
        this.index++;
        return result;
    } else {
        throw "Index out of bound : " + this.index;
    }
};


/* Email */


sforce.Email = function() {
};

sforce.Email.prototype = new sforce.Xml("messages");

sforce.MassEmailMessage = function() {
};

sforce.MassEmailMessage.prototype = new sforce.Xml("messages");
sforce.MassEmailMessage.prototype._xsiType = "MassEmailMessage";



sforce.SingleEmailMessage = function() {
};

sforce.SingleEmailMessage.prototype = new sforce.Xml("messages");
sforce.SingleEmailMessage.prototype._xsiType = "SingleEmailMessage";



/* ProcessRequest */


sforce.ProcessRequest = function() {
};

sforce.ProcessRequest.prototype = new sforce.Xml("actions");

sforce.ProcessSubmitRequest = function() {
};

sforce.ProcessSubmitRequest.prototype = new sforce.Xml("actions");
sforce.ProcessSubmitRequest.prototype._xsiType = "ProcessSubmitRequest";


sforce.ProcessWorkitemRequest = function() {
};

sforce.ProcessWorkitemRequest.prototype = new sforce.Xml("actions");
sforce.ProcessWorkitemRequest.prototype._xsiType = "ProcessWorkitemRequest";
/* set up connection */
sforce.connection = new sforce.Connection();

var UserContext = (typeof window.UserContext != "undefined") ? window.UserContext : {
    siteUrlPrefix : "",
    getUrl : function (url) {
        // fix URL for sites with prefixes
        if (typeof url == "undefined" || typeof UserContext.siteUrlPrefix == "undefined" || !UserContext.siteUrlPrefix)
            return url;

        if (url.indexOf('/') != 0)
            return url;

        if(url.indexOf(UserContext.siteUrlPrefix) == 0)
            return url;

        return UserContext.siteUrlPrefix + url;
    }
};

if (typeof(__sfdcSiteUrlPrefix) != "undefined") {
    UserContext.siteUrlPrefix = __sfdcSiteUrlPrefix;
}

sforce.connection.serverUrl = (typeof window.UserContext != "undefined") ? UserContext.getUrl("/services/Soap/u/37.0") : "/services/Soap/u/37.0";

if (typeof(__sfdcSessionId) != "undefined") {
    sforce.connection.sessionId = __sfdcSessionId;
}
