"use strict";
import {yardb, username, password} from "./configuration.js"
import {model} from "./model.js"

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

    all("main nav", element => element.style.display = "none")

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
            element.classList.replace("active","inactive")
        })
        event.target.classList.add("active")
        all("main nav div", element => {
            element.classList.replace("active","inactive")
        })
        all("main nav", element => element.style.display = "none")
        all("main nav." + event.target.getAttribute("id"), element => element.style.display = "block")
        render("")
    })

    all("main nav div.post", element => element.onclick = event => {
        siblings(event.target, element => {
            element.classList.replace("active","inactive")
        })
        event.target.classList.add("active")
        const name = one("aside nav div.active").getAttribute("id")
        model.form(name).then(render)
    })

    all("main nav div.get", element => element.onclick = event => {
        event.preventDefault()
        siblings(event.target, element => {
            element.classList.replace("active","inactive")
        })
        event.target.classList.add("active")
        const name = one("aside nav div.active").getAttribute("id")
        model.read(name).then(render)
    })

    one("main article").onsubmit = event => {
        event.preventDefault()
        model.create().then(render)
    }
}
