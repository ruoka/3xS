$(document).ready(function() {

	var clock = function() {
		var date = new Date()
		var zone = date.getTimezoneOffset()
		zone = -zone / 60
		date.setHours(date.getHours() + zone)
		$("main header time").text(date.toISOString().substring(0, 19) + "+0" + zone + ":00")
		setTimeout(clock, 1000)
	}
	clock()
	setTimeout(clock, 1000)

	$("main header nav").hide()

	$("aside nav div").on("click", function() {
		$("#article").empty()
		$("main header nav div").css("color", "lime")
		$("main header nav div").css("background", "black")
		$("main header nav div").removeClass("active")
		$("main header nav").hide()
		$("main header nav." + $(this).attr("id")).show()
		$(this).parent("nav").children("div").css("color", "lime")
		$(this).parent("nav").children("div").css("background", "black")
		$(this).parent("nav").children("div").removeClass("active")
		$(this).css("color", "black")
		$(this).css("background", "lime")
		$(this).addClass("active")
	})

    var models = {};

	$("main header nav div.get").on("click", function() {
        var name = $("aside nav div.active").attr("id")
		$("#article").empty()
		$("#article").load("http://localhost:2112/" + name)
		$(this).parent("nav").children("div").css("color", "lime")
		$(this).parent("nav").children("div").css("background", "black")
		$(this).parent("nav").children("div").removeClass("active")
		$(this).css("color", "black")
		$(this).css("background", "lime")
		$(this).addClass("active")
	})

	$("main header nav div.post").on("click", function() {
        var name = $("aside nav div.active").attr("id")
		$("#article").empty()
		$("#article").html(render_form(name, models[name]))
		$(this).parent("nav").children("div").css("color", "lime")
		$(this).parent("nav").children("div").css("background", "black")
		$(this).parent("nav").children("div").removeClass("active")
		$(this).css("color", "black")
		$(this).css("background", "lime")
		$(this).addClass("active")
	})

	$("nav div").hover(function() {
		if ($(this).hasClass("active")) {
			$(this).css("background", "green")
		} else {
			$(this).css("color", "black")
			$(this).css("background", "lime")
		}
	}, function() {
		if ($(this).hasClass("active")) {
			$(this).css("background", "lime")
		} else {
			$(this).css("color", "lime")
			$(this).css("background", "black")
		}
	})

	function construct_document(form) {
		var data = {}
		var inputs = $(form).children("[name]")
		$.map(inputs, function(value) {
			data[value.name] = $(value).val()
		})
		var sets = $(form).children("fieldset[name]")
		$.map(sets, function(value) {
			data[value.name] = construct_document(value)
		})
		return data
	}

	$("main article").on("submit", "form", function(event) {
		event.preventDefault()
		var data = construct_document(this)
		window.alert(JSON.stringify(data))
		$(this).attr("disabled", true)
		$.ajax({
			type: $(this).attr("method"),
			url: $(this).attr("action"),
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json",
			beforeSend: function() {},
			success: function(data) {
				window.alert("Success")
			},
			error: function(data) {
				window.alert("Error")
			}
		})
	})

    function render_fieldset(fields) {
    	var form = ""
    	$.each(fields, function(name, fields) {
    		if ("type" in fields) {
    			form += "<label>" + name + "</label>"
    			form += "<input name = '" + name + "' "
    			$.each(fields, function(attribute, value) {
    				form += attribute + "='" + value + "' "
    			})
    			form += ">"
    			form += "<br/>"
    		} else if ("select" in fields) {
    			form += "<label>" + name + "</label>"
    			form += "<select name = '" + name + "'>"
    			$.each(fields.select, function(index, value) {
    				form += "<option value ='" + value + "'>"
    				form += value
    				form += "</optaion>"
    			})
    			form += "</select>"
    			form += "<br/>"
    		} else {
    			form += "<fieldset name='" + name + "'>"
    			form += "<legend>" + name + "</legend>"
    			form += render_fieldset(fields)
    			form += "</fieldset>"
    		}
    	})
    	return form
    }

    function render_form(name, document) {
    	var form = "<form action='http://localhost:2112/" + name + "' method='post'>"
    	form += "<fieldset name='" + name + "'>"
    	// form += "<legend>" + name + "</legend>"
    	form += render_fieldset(document)
    	form += "</fieldset>"
    	form += "<input id='submit' type='submit' value='Submit'>"
    	form += "</form>"
    	return form
    }

	$.ajax({
		type: "GET",
		url: "models.json",
		data: {},
		dataType: "json",
		contentType: "application/json",
		beforeSend: function() {},
		success: function(data) {
			models = data;
			window.alert(JSON.stringify(models))
		},
		error: function(data) {
			window.alert("Error")
		}
	})
})
