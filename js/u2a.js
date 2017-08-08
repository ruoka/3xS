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

	$("main header nav div").on("click", function() {
		$("#article").empty()
		$("#article").load($(this).attr("data-request"))
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

	function model(form) {
		var data = {}
		var inputs = $(form).children("[name]")
		$.map(inputs, function(value) {
			data[value.name] = $(value).val()
		})
		var sets = $(form).children("fieldset[name]")
		$.map(sets, function(value) {
			data[value.name] = model(value)
		})
		return data
	}

	$("main article").on("submit", "form", function(event) {
		event.preventDefault()
		var data = model(this)
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

	$.ajax({
		type: "GET",
		url: "documents.json",
		data: {},
		dataType: "json",
		contentType: "application/json",
		beforeSend: function() {},
		success: function(data) {
			var names = data
			window.alert(JSON.stringify(data))
		},
		error: function(data) {
			window.alert("Error")
		}
	})
})
