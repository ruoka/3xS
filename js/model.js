"use strict";
import {yardb, username, password} from "./configuration.js"

let models = {}

export let model = {

    setup() {
        fetch("models.json", {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(json => models = json)
        .catch(error => alert("Failed to load the model: ", error))
    },

    form(name) {
        return new Promise(async (resolve, reject) => {

            const renderFieldset = (set, fields, legend) => {

                let fieldset = "<fieldset name=" + set + ">"

                if (legend === true)
                    fieldset += "<legend>" + set + "</legend>"

                for(const [name, attibutes] of Object.entries(fields)) {
                    if (!("readonly" in attibutes)) {
                        if ("type" in attibutes) {
                            fieldset += "<label>" + name + "</label>"
                            fieldset += "<input name = '" + name + "' "
                            for(const [attribute, value] of Object.entries(attibutes)) {
                                fieldset += attribute + "='" + value + "' "
                            }
                            fieldset += ">"
                            fieldset += "<br/>"
                        } else if ("select" in attibutes) {
                            fieldset += "<label>" + name + "</label>"
                            fieldset += "<select name = '" + name + "'>"
                            for(const [index, value] of Object.entries(attibutes.select)) {
                                fieldset += "<option value ='" + value + "'>"
                                fieldset += value
                                fieldset += "</option>"
                            }
                            fieldset += "</select>"
                            fieldset += "<br/>"
                        } else {
                            fieldset += ""
                            fieldset += renderFieldset(name, attibutes, true)
                        }
                    }
                }

                fieldset += "</fieldset>"
                return fieldset
            }

            const model = models[name]
            let form = "<form action='" + yardb + name + "' method='post'>"
            form += renderFieldset(name, model, false)
            form += "<input id='submit' type='submit' value='Submit'>"
            form += "</form>"
            resolve(form)
        })
    },

    create() {
        return new Promise(async (resolve, reject) => {

            const constructObject = (fieldset) => {
                let data = {};
                for(const element of fieldset.querySelectorAll("[name]")) {
                    if(element.getAttribute("step") == "0.01")
                    data[element.name] = parseFloat(element.value, 10)
                    else if(element.getAttribute("step") == "1")
                    data[element.name] = parseInt(element.value, 10)
                    else if (element.value != "")
                    data[element.name] = element.value
                    else {
                        data[element.name] = null
                    }
                }
                for(const element of fieldset.querySelectorAll("fieldset[name]")) {
                    data[element.name] = constructObject(element)
                }
                return data;
            }

            const fieldset = document.querySelector("fieldset[name]");
            const form = fieldset.parentElement;
            let data = constructObject(fieldset);

            alert(JSON.stringify(data))

            const text = await fetch(yardb + fieldset.getAttribute("name"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa(username + ":" + password)
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                alert("Post succeeded: " + JSON.stringify(data))
                for(const field of fieldset.children) (
                    field.disabled = true
                )
                form.querySelector("#submit").style.display = "none"
                return form.innerHTML.slice();
            })
            .catch(error => {
                alert("Post failed: ", error);
            })
            resolve(text)
        })
    },

    read(name) {

        return fetch(yardb + name + "?$desc", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(username + ":" + password)
            },
        })
        .then(response => response.json())
        .then(data => {
            alert(JSON.stringify(data))

            const renderHeader = (fields, parent) => {
                let header = ""
                for(const [name, attibutes] of Object.entries(fields)) {
                    if ("type" in attibutes || "select" in attibutes) {
                        header += "<th>" + parent + name + "</th>"
                    } else if (parent === "") {
                        header += renderHeader(attibutes, name + ".")
                    }
                    else {
                        header += renderHeader(attibutes, parent + name + ".")
                    }
                }
                return header
            }

            const renderRow = (model, document) => {
                let row = ""
                for(const [name, attibutes] of Object.entries(model)) {
                    if ("type" in attibutes || "select" in attibutes) {
                        row += "<td>" + document[name] + "</td>"
                    } else {
                        row += renderRow(attibutes, document[name])
                    }
                }
                return row
            }

            const model = models[name]

            let table = "<table class='rounded-corners'>"
            table += "<tr>"
            table += renderHeader(model,"")
            table += "</tr>"
            for(const [index, document] of Object.entries(data)) {
                table += "<tr>"
                table += renderRow(model, document)
                table += "</tr>"
            }
            table += "</table>"
            return table
        })
        .catch(error => alert("Failed to load the data: ", error))
    }
}

model.setup()
