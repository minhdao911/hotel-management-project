/* 
author @minhdao
 */
//import xmlToJson from 'xml2json';

let userData = localStorage.getItem('userData');

if(userData === null){
    alert("Something went wrong, please login again!");
    window.location.replace("../index.html");
}

document.addEventListener("DOMContentLoaded", function (event) {
    
    const userNameLi = document.querySelector("#userName");
    const depNameLi = document.querySelector("#depName");
    const userTitleLi = document.querySelector("#userTitle");
    const urgentNewDiv = document.querySelector("#new .urgent");
    const urgentProcessDiv = document.querySelector("#process .urgent");
    const addForm = document.querySelector("#addForm");
    const checkBox = document.getElementById("checkBox");
    const newTaskDiv = document.querySelector("#new .content");
    const allTaskDiv = document.querySelector("#all .content");
    const completedTaskDiv = document.querySelector("#completed .content");
    const canceledTaskDiv = document.querySelector("#canceled .content");
    const processTaskDiv = document.querySelector("#process .content");
    const logoutBtn = document.querySelector("#logoutBtn");
    const file = document.getElementById("file");
    const loader = document.querySelectorAll(".loader");

    let userObj = JSON.parse(userData);
    console.log(userObj);
    
    const currentUrl = window.location;
    const wsUrl = "ws://" + currentUrl.hostname + "/AppServer/actions/" + userObj.employee.department.id;
    
    var socket = new WebSocket(wsUrl);
    socket.onmessage = onMessage;
    
    function onMessage(event) {
        console.log("onMessage");
        var task = JSON.parse(event.data);
        console.log(task);
        if (task.action === "add") {
            console.log("add action");
            if(task.isUrgent) addNewTask(task, urgentNewDiv);
            else addNewTask(task, newTaskDiv);
            loader[0].style.display = "flex";
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    loader[0].style.display = "none";
                    showTaskData(json, allTaskDiv);
                })
                .catch(error => console.log(error));
        }
        if (task.action === "cancel") {
            console.log("cancel action");
            document.getElementById(task.id).remove();
            addTask(task, canceledTaskDiv);
            loader[0].style.display = "flex";
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    loader[0].style.display = "none";
                    showTaskData(json, allTaskDiv);
                })
                .catch(error => console.log(error));
        }
        if (task.action === "accept") {
            console.log("accept action");
            document.getElementById(task.id).remove();
            if(task.isUrgent) addProcessTask(task, urgentProcessDiv);
            else addProcessTask(task, processTaskDiv);
            loader[0].style.display = "flex";
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    loader[0].style.display = "none";
                    showTaskData(json, allTaskDiv);
                })
                .catch(error => console.log(error));
        }
        if (task.action === "complete") {
            console.log("complete action");
            document.getElementById(""+task.id).remove();
            addTask(task, completedTaskDiv);
            loader[0].style.display = "flex";
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    loader[0].style.display = "none";
                    showTaskData(json, allTaskDiv);
                })
                .catch(error => console.log(error));
        }
    }
    
    let taskData = {
        userId: userObj.employee.id,
        userName: userObj.employee.userName
    };
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + "//" + getUrl.host;
    const url = baseUrl + "/ws/task/dep/" + userObj.employee.department.id;
    
    let showUserData = function(user){
        let name = user.employee.firstName + " " + user.employee.lastName;
        userNameLi.textContent = name;
        depNameLi.textContent = user.employee.department.name;
        userTitleLi.textContent = user.employee.employeeTitle.name;
    };
    
    let checkStatus = function(data){
        let result = "";
        if(data.isCancelled){
            result = "CANCELED";
        }else{
            if(data.completionUser){
                if(data.completionTime){
                    result = "DONE";
                }else{
                    result = "PROCESS";
                }
            }else{
                result = "NEW";
            }
        }
        return result;
    };
    
    let displayTask = function(d){
        let desc = d.description ? d.description : "";
        let loc = d.location ? d.location.replace(/\b\w/g, l => l.toUpperCase()) : "";
        let crt = d.creationTime ? convertTime(d.creationTime) : "";
        let ct = d.completionTime ? convertTime(d.completionTime) : "";
        let cu = d.completionUser ? d.completionUser : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        let name = d.name ? d.name.toUpperCase() : "";
        let img = d.fileData ? `<img src="data:image/png;base64,${d.fileData}">`: "";
        let status = checkStatus(d);
        let result =  `
            <div class="task">
              <p class="task-name">${name}</p>
              <div class="label ${status.toLowerCase()}-label">
                ${status}
              </div>
              <p>Place: <span>${loc}</span></p>
              <p>${crt}</p>
              <p>${ct}</p>
              <div class="down">
                <i class="fa fa-chevron-down"></i>
              </div>
              <div class="additional-info hidden">
                <p>Description: <span>${desc}</p>
                <p>Attachment: <span>${fl}</span></p>
                ${img}
              </div>
              <div class="up hidden">
                <i class="fa fa-chevron-up"></i>
              </div>
            </div>
        `;
        return result;
    };
    
    let displayNewTask = function(d){
        let desc = d.description ? d.description : "";
        let loc = d.location ? d.location.replace(/\b\w/g, l => l.toUpperCase()) : "";
        let crt = d.creationTime ? convertTime(d.creationTime) : "";
        let name = d.name ? d.name.toUpperCase() : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        let img = d.fileData ? `<img src="data:image/png;base64,${d.fileData}">`: "";
        let display = d.creationUser === userObj.employee.userName ? "none" : "inline-block";
        let result = `
            <div class="task" id="${d.id}">
              <p class="task-name">${name}</p>
              <div class="buttons">
                <i class="fa fa-check-circle" style="display: ${display};"></i>
                <i class="fa fa-times-circle"></i>
              </div>
              <p>Place: <span>${loc}</span></p>
              <p>${crt}</p>
              <div class="down">
                <i class="fa fa-chevron-down"></i>
              </div>
              <div class="additional-info hidden">
                <p>Description: <span>${desc}</p>
                <p>Attachment: <span>${fl}</span></p>
                ${img}
              </div>
              <div class="up hidden">
                <i class="fa fa-chevron-up"></i>
              </div>
            </div>
        `;
        return result;
    };
    
    let displayProcessTask = function(d){
        let desc = d.description ? d.description : "";
        let loc = d.location ? d.location.replace(/\b\w/g, l => l.toUpperCase()) : "";
        let crt = d.creationTime ? convertTime(d.creationTime) : "";
        let name = d.name ? d.name.toUpperCase() : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        let img = d.fileData ? `<img src="data:image/png;base64,${d.fileData}">`: "";
        let visibility = d.completionUser === userObj.employee.userName ? "visible" : "hidden";
        let result = `
            <div class="task" id="${d.id}">
              <p class="task-name">${name}</p>
              <div class="buttons" style="visibility: ${visibility};">
                <i class="fa fa-check-circle"></i>
                <i class="fa fa-times-circle"></i>
              </div>
              <p>Place: <span>${loc}</span></p>
              <p>${crt}</p>
              <div class="down">
                <i class="fa fa-chevron-down"></i>
              </div>
              <div class="additional-info hidden">
                <p>Description: <span>${desc}</p>
                <p>Attachment: <span>${fl}</span></p>
                ${img}
              </div>
              <div class="up hidden">
                <i class="fa fa-chevron-up"></i>
              </div>
            </div>
        `;
        return result;
    };
    
    let addTask = function(data, div){
        div.innerHTML = displayTask(data) + div.innerHTML;
    };
    
    let addNewTask = function(data, div){
        div.innerHTML = displayNewTask(data) + div.innerHTML;
    };
    
    let addProcessTask = function(data, div){
        div.innerHTML = displayProcessTask(data) + div.innerHTML;
    };
    
    let showTaskData = function(data, div){
        div.innerHTML = "";
        if(data.length > 1){
            for(let d of data){
                div.innerHTML += displayTask(d);
            }
        }else if (data.length === 1){
            let d = data[0];
            div.innerHTML += displayTask(d);
        }
    };
    
    let showNewTaskData = function(data, div){
        div.innerHTML = "";
        if(data.length > 1){
            for(let d of data){
                div.innerHTML += displayNewTask(d);
            }
        }else if (data.length === 1){
            let d = data[0];
            div.innerHTML += displayNewTask(d);
        }
    };
    
    let showProcessTaskData = function(data, div){
        div.innerHTML = "";
        if(data.length > 1){
            for(let d of data){
                div.innerHTML += displayProcessTask(d);
            }
        }else if (data.length === 1){
            let d = data[0];
            div.innerHTML += displayProcessTask(d);
        }
    };
    
    let convertTime = function(d){
        let dateArr = d.split(".");
        return dateArr[0];
    };
    
    logoutBtn.addEventListener("click", function(){
        localStorage.removeItem('userData');
        window.location.replace("../index.html");
    });
    
    function sendData() {
        const formData = new FormData();
        for(let name in taskData){
            formData.append(name, taskData[name]);
        }
        formData.append("file", file.files[0]);
        
        fetch(baseUrl+"/upload", {
            method: "POST",
            body: formData
        }).then(response => console.log(response));
    }
    
    addForm.addEventListener("input", function(){
        taskData.name = addForm.querySelector("input[name='name']").value;
        taskData.location = addForm.querySelector("input[name='location']").value;
        taskData.desc = addForm.querySelector("textarea[name='desc']").value;
        taskData.dep = addForm.querySelector("select[name='dep']").value;
        taskData.urgent = false;
    });
    
    checkBox.addEventListener("click", function(){
        if(this.checked) taskData.urgent = true;
        else taskData.urgent = false;
    });
    
    addForm.addEventListener("submit", function(e){
        e.preventDefault();
        sendData();
        addForm.reset();
    });
    
    document.querySelector("#main").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-check-circle"){
            let id = e.target.parentNode.parentNode.id;
            let putUrl = baseUrl + "/ws/task/" + id + "/" + userObj.employee.userName;
            
            loader[0].style.display = "flex";
            loader[4].style.display = "flex";
            
            fetch(putUrl, {method: "PUT"})
                .then(response => fetch(url+"/process"))
                    .then(response => response.json())
                    .then(json => {
                        showProcessTaskData(json, processTaskDiv);
                    })
                .then(result => fetch(url+"/urgent/process"))
                    .then(response => response.json())
                    .then(json => {
                        loader[4].style.display = "none";
                        showProcessTaskData(json, urgentProcessDiv);
                    })
                .then(result => fetch(url))
                    .then(response => response.json())
                    .then(json => {
                        loader[0].style.display = "none";
                        showTaskData(json, allTaskDiv);
                    })
                    .catch(error => console.log(error));
        }
    });
    
    document.querySelector("#main").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-times-circle"){
            let id = e.target.parentNode.parentNode.id;
            let putUrl = baseUrl + "/ws/task/cancel/" + id;
            
            loader[0].style.display = "flex";
            loader[3].style.display = "flex";
            
            fetch(putUrl, {method: "PUT"})
                .then(response => fetch(url+"/cancelled"))
                    .then(response => response.json())
                    .then(json => {
                        loader[3].style.display = "none";
                        showTaskData(json, canceledTaskDiv);
                    })
                .then(result => fetch(url))
                    .then(response => response.json())
                    .then(json => {
                        loader[0].style.display = "none";
                        showTaskData(json, allTaskDiv);
                    })
                    .catch(error => console.log(error));
        }
    });
    
    document.querySelector("#process").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-check-circle"){
            let id = e.target.parentNode.parentNode.id;
            let putUrl = baseUrl + "/ws/task/" + id;
            
            loader[0].style.display = "flex";
            loader[2].style.display = "flex";
            
            fetch(putUrl, {method: "PUT"})
                .then(response => fetch(url+"/completed"))
                    .then(response => response.json())
                    .then(json => {
                        loader[2].style.display = "none";
                        showTaskData(json, completedTaskDiv);
                    })
                .then(result => fetch(url))
                    .then(response => response.json())
                    .then(json => {
                        loader[0].style.display = "none";
                        showTaskData(json, allTaskDiv);
                    })
                    .catch(error => console.log(error));
        }
    });
    
    document.querySelector("#process").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-times-circle"){
            let id = e.target.parentNode.parentNode.id;
            let putUrl = baseUrl + "/ws/task/cancel/" + id;
            
            loader[0].style.display = "flex";
            loader[3].style.display = "flex";
            
            fetch(putUrl, {method: "PUT"})
                .then(response => fetch(url+"/cancelled"))
                    .then(response => response.json())
                    .then(json => {
                        loader[3].style.display = "none";
                        showTaskData(json, canceledTaskDiv);
                    })
                .then(result => fetch(url))
                    .then(response => response.json())
                    .then(json => {
                        loader[0].style.display = "none";
                        showTaskData(json, allTaskDiv);
                    })
                    .catch(error => console.log(error));
        }
    });
    
    showUserData(userObj);
    
    fetch(baseUrl+"/ws/task/set")
        .then(response => console.log(response))
        .catch(error => console.log(error));

    fetch(url)
        .then(response => response.json())
        .then(json => {
            loader[0].style.display = "none";
            showTaskData(json, allTaskDiv);
        })
        .catch(error => console.log(error));


    fetch(url+"/new")
        .then(response => response.json())
        .then(json => {
            showNewTaskData(json, newTaskDiv);
        })
        .catch(error => console.log(error));

        fetch(url+"/process")
        .then(response => response.json())
        .then(json => {
            showProcessTaskData(json, processTaskDiv);
        })
        .catch(error => console.log(error));

    fetch(url+"/completed")
        .then(response => response.json())
        .then(json => {
            loader[2].style.display = "none";
            showTaskData(json, completedTaskDiv);
        })
        .catch(error => console.log(error));

    fetch(url+"/cancelled")
        .then(response => response.json())
        .then(json => {
            loader[3].style.display = "none";
            showTaskData(json, canceledTaskDiv);
        })
        .catch(error => console.log(error));

    fetch(url+"/urgent/new")
        .then(response => response.json())
        .then(json => {
            loader[1].style.display = "none";
            showNewTaskData(json, urgentNewDiv);
        })
        .catch(error => console.log(error));

    fetch(url+"/urgent/process")
        .then(response => response.json())
        .then(json => {
            loader[4].style.display = "none";
            showProcessTaskData(json, urgentProcessDiv);
        })
        .catch(error => console.log(error));
});
