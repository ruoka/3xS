$(document).ready(function () {

    var username = ""
    var password = ""
    var models = {}

    $("main header nav").hide()

    if (username == "" || password == "") {
        $("aside nav").hide()
        $("main form").show()
        $("main article").hide()
    }
    else {
        $("aside nav").show()
        $("main form").hide()
        $("main article").show()
    }

    function clock() {
        var date = new Date()
        var zone = date.getTimezoneOffset()
        zone = -zone / 60
        date.setHours(date.getHours() + zone)
        $("main header time").text(date.toISOString().substring(0, 19) + "+0" + zone + ":00")
        setTimeout(clock, 1000)
    }
    clock()
    setTimeout(clock, 1000)

    $("#login").on("click", function(event) {
        event.preventDefault()
        alert("Login")
        var date = new Date()
        var username = $("#username").val()
        var password = $("#password").val()
        var data = {username: username, timestamp: date.toISOString()}
        $.ajaxSetup({
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password)
            }
        })
        $.ajax({
            type: "POST",
            url: "http://localhost:2112/logins",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                alert("Success")
                $.ajax({
                    type: "GET",
                    url: "models.json",
                    dataType: "json",
                    contentType: "application/json",
                    success: function(data) {
                        models = data;
                        // alert(JSON.stringify(models))
                        $("aside nav").show()
                        $("main form").hide()
                        $("main article").show()
                        $("aside nav div").css("color", "lime")
                    },
                    error: function(data) {
                        alert("Error")
                    }
                })
            },
            error: function(data) {
                alert("Error")
            }
        })
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

    $("main header nav div.post").on("click", function() {
        $("#article").empty()
        $("#article").html(renderForm())
        $(this).parent("nav").children("div").css("color", "lime")
        $(this).parent("nav").children("div").css("background", "black")
        $(this).parent("nav").children("div").removeClass("active")
        $(this).css("color", "black")
        $(this).css("background", "lime")
        $(this).addClass("active")
    })

    $("main header nav div.get").on("click", function() {
        $("#article").empty()
        $(this).parent("nav").children("div").css("color", "lime")
        $(this).parent("nav").children("div").css("background", "black")
        $(this).parent("nav").children("div").removeClass("active")
        $(this).css("color", "black")
        $(this).css("background", "lime")
        $(this).addClass("active")
        var name = $("aside nav div.active").attr("id")
        // alert(name)
        $.ajax({
            type: "GET",
            url: "http://localhost:2112/" + name + "?desc",
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                alert(JSON.stringify(data))
                $("#article").html(renderTable(name,data))
            },
            error: function(data) {
                alert("Error")
            },
            xhrFields: {withCredentials: true}
        })
    })

    $("main article").on("submit", "form", function(event) {
        event.preventDefault()
        var data = constructObject()
        $(this).children().prop("disabled", true)
        $(this).children("#submit").hide()
        alert(JSON.stringify(data))
        $.ajax({
            type: $(this).attr("method"),
            url: $(this).attr("action"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                alert("Success")
            },
            error: function(data) {
                alert("Error")
            }
        })
    })

    function renderFieldset(name, fields, legend) {
        var fieldset = ""
        fieldset += "<fieldset name='" + name + "'>"
        if (legend)
           fieldset += "<legend>" + name + "</legend>"
        $.each(fields, function(name, fields) {
            if ("type" in fields) {
                fieldset += "<label>" + name + "</label>"
                fieldset += "<input name = '" + name + "' "
                $.each(fields, function(attribute, value) {
                    fieldset += attribute + "='" + value + "' "
                })
                fieldset += ">"
                fieldset += "<br/>"
            } else if ("select" in fields) {
                fieldset += "<label>" + name + "</label>"
                fieldset += "<select name = '" + name + "'>"
                $.each(fields.select, function(index, value) {
                    fieldset += "<option value ='" + value + "'>"
                    fieldset += value
                    fieldset += "</optaion>"
                })
                fieldset += "</select>"
                fieldset += "<br/>"
            } else {
                fieldset += ""
                fieldset += renderFieldset(name, fields, true)
            }
        })
        fieldset += "</fieldset>"
        return fieldset
    }

    function renderForm() {
        var name = $("aside nav div.active").attr("id")
        var form = "<form action='http://localhost:2112/" + name + "' method='post'>"
        form += renderFieldset(name, models[name], false)
        form += "<input id='submit' type='submit' value='Submit'>"
        form += "</form>"
        return form
    }

    function constructFields(fieldset) {
        var data = {}
        $(fieldset).children("[name]").each(function(index, element) {
            if ($(element).val() != "")
                data[element.name] = $(element).val()
            else {
                data[element.name] = null
            }
        })
        $(fieldset).children("fieldset[name]").each(function(index, element) {
            data[element.name] = constructFields(element)
        })
        return data;
    }

    function constructObject() {
        var name = $("aside nav div.active").attr("id")
        return constructFields($("fieldset[name=" + name +"]"));
    }

    function renderTable(name, array) {
        var model = models[name]
        var table = "<table>"
        table += "<tr>"
        $.each(model, function(name, element) {
            table += "<th>" + name + "</th>"
        })
        table += "</tr>"
        $.each(array, function(name, document) {
            table += "<tr>"
            $.each(model, function(name, element) {
                table += "<td>" + document[name] + "</td>"
            })
            table += "</tr>"
        })
        table += "</table>"
        return table
    }
})
