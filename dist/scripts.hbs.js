// Handlebars.registerPartial('_table', '{{table}}');

var compileThis = function(template, data, container){
	var compile = Handlebars.compile(template);
	var result = compile(data);
	container.innerHTML = result;
};


function displayTemplate(tmpl, data, container){
	console.log('display');
	if (templates[tmpl] === undefined){
		return;
	}

	var template = templates[tmpl];
	var html = template(data);
	container.innerHTML = html;
}


function getTemplateAjax(path, callback){
	var source, template;
	jQuery.ajax({
		url: path,
		success: function(data){
			source = data;
			template = Handlebars.compile(source);
			if(callback) callback(template);
		}
	});
}

function retrieveData(){
	var dataSource = db.url;
	jQuery.getJSON(dataSource, renderDataVisualsTemplate);
}

function renderHandlebarsTemplate(withTemplate, inElement, withData){
	// document.querySelector(inElement).innerHTML = template(withData);
	getTemplateAjax(withTemplate, function(template){
		// jQuery(inElement).html(template(withData));
		document.querySelector(inElement).insertAdjacentHTML('beforeend', template(withData));
		var compiledContent = document.getElementById('dataTable').innerHTML;
		var container = document.querySelector('[data-hbsinjection="table"]');

		compileThis(compiledContent, withData, container);
	});
}

function renderDataVisualsTemplate(data){
	var template = renderHandlebarsTemplate('/partials/_dataTable.hbs','head', data);
}

var db={
	key:"WCcxN5OxgP5SLRcpLUd9y1wuAI5dne7W",
	name:'tv',
	collection:'referrals',
	url: "https://api.mlab.com/api/1/databases/tv/collections/referrals?apiKey=WCcxN5OxgP5SLRcpLUd9y1wuAI5dne7W",
};

// var dataTable = Handlebars.getTemplate("dataTable", "btn-group.html");


 document.addEventListener("DOMContentLoaded", function(event) {
	retrieveData();
});