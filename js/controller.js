const yardb = "http://localhost:2112/"
var username = ""
var password = ""

const model = {

    models: [],

    setup() {
        fetch("model.json", {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => models = data)
        .catch(error => alert("Failed to load the model: ", error))
    },

    form(name) {

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
        return form
    },

    create() {

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
        let data = constructObject(fieldset);

        alert(JSON.stringify(data))

        fetch(yardb + fieldset.getAttribute("name"), {
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
            fieldset.parentElement.querySelector("#submit").style.display = "none"
        })
        .catch(error => {
            alert("Post failed: ", error);
        });
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

            const model = models[name]

            let table = "<table>"
            table += "<tr>"
            for(const [name, value] of Object.entries(model)) {
                table += "<th>" + name + "</th>"
            }
            table += "</tr>"
            for(const [index, document] of Object.entries(data)) {
                table += "<tr>"
                for(const [name, value] of Object.entries(model)) {
                    table += "<td>" + document[name] + "</td>"
                }
                table += "</tr>"
            }
            table += "</table>"
            return table
        })
        .catch(error => alert("Failed to load the data: ", error))
    }
}

model.setup()

window.onload = () => {

    const one = tagname => document.querySelector(tagname)

    const all = (tagname, callback) => {
        const elements = document.querySelectorAll(tagname)
        for(const element of elements) {
            callback(element)
        }
    }

    const siblings = (node, callback) => {
        const elements = node.parentElement.children;
        for(const element of elements) {
            if(!element.isSameNode(node))
            callback(element)
        }
    }

    const clock = () => {
        const date = new Date()
        const zone = -1 * date.getTimezoneOffset() / 60
        date.setHours(date.getHours() + zone)
        one("main header time").textContent = date.toISOString().substring(0, 19) + "+0" + zone + ":00"
        setTimeout(clock, 1000)
    }

    clock()

    if (username == "" || password == "") {
        one("aside nav").style.display = "none"
        one("main form").style.display = "block"
        one("main article").style.display = "none"
    }
    else {
        one("aside nav").style.display = "block"
        one("main form").style.display = "none"
        one("main article").style.display = "block"
    }

    const render = (content) => {
        const div = one("#article")
        while(div.firstChild) div.removeChild(div.firstChild)
        one("#article").innerHTML = content
    }

    all("main header nav", element => element.style.display = "none")

    one("#login").onclick = event => {
        alert("Login")
        event.preventDefault()
        const date = new Date()
        const username = one("#username").value
        const password = one("#password").value
        const data = {username: username, timestamp: date.toISOString}

        fetch(yardb + "logins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(username + ":" + password)
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            alert("Login succeeded: " + JSON.stringify(data))
            one("aside nav").style.display = "block"
            one("main form").style.display = "none"
            one("main article").style.display = "block"
            all("aside nav div", element => element.style.color = "lime")
        })
        .catch(error => {
            alert("Login failed: ", error);
        });
    }

    all("nav div", element => element.onmouseover = event => {
        if (event.target.classList.contains("active")) {
            event.target.style.backgroundColor = "green"
        } else {
            event.target.style.color = "black"
            event.target.style.backgroundColor = "lime"
        }
    })

    all("nav div", element => element.onmouseleave = event => {
        if (event.target.classList.contains("active")) {
            event.target.style.backgroundColor = "lime"
        } else {
            event.target.style.color = "lime"
            event.target.style.backgroundColor = "black"
        }
    })

    all("aside nav div", element => element.onclick = event => {
        siblings(event.target, element => {
            element.classList.remove("active")
            element.style.color = "lime"
            element.style.backgroundColor = "black"
        })
        event.target.classList.add("active")
        event.target.style.color = "black"
        event.target.style.backgroundColor = "lime"
        all("main header nav div", element => {
            element.classList.remove("active")
            element.style.color = "lime"
            element.style.backgroundColor = "black"
        })
        all("main header nav", element => element.style.display = "none")
        all("main header nav." + event.target.getAttribute("id"), element => element.style.display = "block")
        render("")
    })

    all("main header nav div.post", element => element.onclick = event => {
        siblings(event.target, element => {
            element.classList.remove("active")
            element.style.color = "lime"
            element.style.backgroundColor = "black"
        })
        event.target.classList.add("active")
        event.target.style.color = "black"
        event.target.style.backgroundColor = "lime"
        const name = one("aside nav div.active").getAttribute("id")
        render(model.form(name))
    })

    all("main header nav div.get", element => element.onclick = event => {
        event.preventDefault()
        siblings(event.target, element => {
            element.classList.remove("active")
            element.style.color = "lime"
            element.style.backgroundColor = "black"
        })
        event.target.classList.add("active")
        event.target.style.color = "black"
        event.target.style.backgroundColor = "lime"
        const name = one("aside nav div.active").getAttribute("id")
        model.read(name).then(content => render(content))
    })

    one("main article").onsubmit = event => {
        event.preventDefault()
        model.create()
    }
}
