//testing cdn refresh
function pad(n) {
	return n < 11 ? "0" + n : n;
}

var time = {};

time.now = new Date();
time.zone = time.now.getTimezoneOffset();
time.sign = time.zone > 0 ? "-" : "+";
time.hours = pad(Math.floor(Math.abs(time.zone) / 60));
time.minutes = pad(Math.abs(time.zone) % 60);

var tzOffset = time.sign + time.hours + ":" + time.minutes;

var localDateTime =
	time.now.getFullYear() +
	"-" +
	pad(time.now.getMonth() + 1) +
	"-" +
	pad(time.now.getDate()) +
	" " +
	pad(time.now.getHours()) +
	":" +
	pad(time.now.getMinutes()) +
	":" +
	pad(time.now.getSeconds());

var eventDate = {
	utc: time.now.toISOString(),
	local: localDateTime,
	tzOffset: tzOffset
};

var localDateString = eventDate.local;
var localDate = new Date(localDateString);

// url: "https://api.mlab.com/api/1/databases/tv/collections/notes?apiKey=WCcxN5OxgP5SLRcpLUd9y1wuAI5dne7W"
var getParameterByName = function(name, url) {
	if (!url) url = window.location.href;
	// console.dir("getting value for " + name + " (using getParameterByName)");
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var addEvent = function(obj, evt, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent("on" + evt, fn);
	}
};

var getClosest = function(el, selector) {
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (
						this.document || this.ownerDocument
					).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	for (; el && el !== "document"; el = el.parentNode) {
		if (el.matches(selector)) {
			return el;
		}
	}
	return null;
};

// getCookie functionality to using a split value (instead of slice).

var getCookie = function(cName) {
	var cStr = "; " + document.cookie;
	var parts = cStr.split("; " + cName + "=");
	if (parts.length == 2) {
		cValue = parts
			.pop()
			.split(";")
			.shift();
		return cValue;
	}
};

var setCookie = function(cName, cValue, cExpires, cPath) {
	if (!cPath) {
		var domain =
			"/;domain=" + window.location.hostname.match(/[^\.]*\.[^.]*$/)[0];
		cPath = domain;
	}
	if (!cExpires) {
		cExpires = new Date(today.getTime() + 30 * 24 * 3600 * 1000);
	}
	document.cookie =
		cName +
		"=" +
		cValue +
		";expires=" +
		cExpires.toGMTString() +
		"; path=" +
		cPath;

	console.log(
		"--- \n this cookie is called " +
			cName +
			"\n it expires on " +
			cExpires +
			"\n the path is " +
			cPath +
			"\n the value is " +
			cValue
	);
	return cValue;
};

var getValue = function(param, url) {
	if (url === undefined) {
		url = window.location.href;
	}
		var parameter =
		getParameterByName(param) != null
			? getParameterByName(param)
			: getCookie(param);
	if (parameter === undefined || parameter === false || parameter === null) {
		return "";
	} else {
		return parameter;
	}
};

var getDBValue = function(id){
	console.log(data);
};

var api = {
	key: "WCcxN5OxgP5SLRcpLUd9y1wuAI5dne7W",
	name: "tv",
	collection: "referrals",
	database: "tv",
	url: "https://api.mlab.com/api/1/databases/"
};

var ref = {
	campaign: getValue("campaign"),
	source: getValue("source"),
	medium: getValue("medium"),
	content: getValue("content"),
	datetime: eventDate.local + " (UTC " + eventDate.tzOffset + " )",
	referral_ad: getValue("referral_ad"),
	sale_price: getValue("sale_price"),
	qty: getValue("qty"),
	discount: getValue("discount"),
	tax: getValue("tax"),
	currency: getValue("currency")
};

var baseurl = api.url + api.database + "/collections/" + api.collection + "/";

var deleteRow = function(id) {
	var url = baseurl + id + "?apiKey=" + api.key;
	$.ajax({
		url: url,
		type: "DELETE",
		async: true,
		timeout: 300000,
		success: function(data) {},
		error: function(xhr, status, err) {}
	});
};

var editRow = function(id) {
	var url = baseurl + id + "?apiKey=" + api.key;

	$.ajax({
		url: url,
		data: JSON.stringify({
			utm_campaign: ref.campaign,
			utm_source: ref.source,
			utm_medium: ref.medium,
			utm_content: ref.content,
			datetime: ref.datetime,
			referral_ad: ref.referral_ad,
			sale_price: ref.sale_price,
			qty: ref.qty,
			discount: ref.discount,
			tax: ref.tax,
			currency: ref.currency
		}),
		type: "PUT",
		contentType: "application/json"
	});
};

//q={'_id':{'$oid':'5be20249019b46dae4adba53'}}&fo=true&apiKey=WCcxN5OxgP5SLRcpLUd9y1wuAI5dne7W
//q={'_id':{'$oid':'5be20249019b46dae4adba53'}}&fo=true&apiKey=WCcxN5OxgP5SLRcpLUd9y1wuAI5dne7W

var findUser = function(id) {
	var query = "?q={'_id':{'$oid':'" + id + "'}}&fo=true";
	var url = baseurl + query + "&apiKey=" + api.key;
	$.get({
		url: url,
		contentType: "application/json",
		success: function(data){
			console.log(data);
			getDBValue(data);
			return true;
		},
		fail: function(e){
			console.log("record not found for id" + id + ".");
			return false;
		}
	});
};

var createRow = function(campaign, source, medium, content) {
	var url = baseurl + "?apiKey=" + api.key;
	$.ajax({
		url: url,
		data: JSON.stringify({
			utm_campaign: ref.campaign,
			utm_source: ref.source,
			utm_medium: ref.medium,
			utm_content: ref.content,
			datetime: ref.datetime,
			referral_ad: ref.referral_ad,
			sale_price: ref.sale_price,
			qty: ref.qty,
			discount: ref.discount,
			tax: ref.tax,
			currency: ref.currency
		}),
		type: "POST",
		contentType: "application/json"
	});
};



window.onload = function(){
	var id = getValue("tvr_id");
	// if(tvr_id){

	// }else{
	// 	editRow();
	// }
	createRow(123, "bowie", "testing", "thiscontent");


};





