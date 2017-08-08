function from_fields_to_fieldset(fields) {
	var form
	$.each(fields, function(name, field) {
		if ("type" in field) {
			form += "<label>" + field + "</label>"
			form += "<input name = '" + field + "'"
			$.each(field, function(attribute, value) {
				form += attribute + "='" + value + "'"
			})
			form += ">"
			form += "<br/>"
		} else if ("select" in field) {
			form += "<label>" + field + "</label>"
			form += "<select name = '" + field + "'>"
			$.each(field.select, function(inx, value) {
				form += "<option value ='" + value + "'>"
				form += value
				form += "</optaion>"
			})
			form += "</select>"
			form += "<br/>"
		} else {
			form += "<fieldset name='" + field + "'>"
			form += "<legend>" + field + "</legend>"
			form += from_fields_to_fieldset(field)
			form += "</fieldset>"
		}
	})
	return form
}

function from_document_to_form(name, document) {
	var form = "<form action='" + name + "' method='post'>"
	form += "<fieldset name='" + name + "'>"
	form += "<legend>" + name + "</legend>"
	form += from_fields_to_fieldset(document)
	form += "</fieldset>"
	form += "<input id='submit' type='submit' value='Submit'>"
	form += "</form>"
	return form
}
