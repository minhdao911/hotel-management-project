/* 
author @minhdao
 */
//import xmlToJson from 'xml2json';
document.addEventListener("DOMContentLoaded", function (event) {
    
    const userNameLi = document.querySelector("#userName");
    const depNameLi = document.querySelector("#depName");
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
    let file = {
        dom    : document.getElementById("file"),
        binary : null
      };
    let reader = new FileReader();
    
//    console.log(urgentNewDiv);
    
    let userData = localStorage.getItem('userData');
//    localStorage.removeItem('userData');

    let userObj = JSON.parse(userData);
    console.log(userObj);
    
    var socket = new WebSocket("ws://209.250.247.110:8080/AppServer/actions/"+userObj.employee.department.id);
    socket.onmessage = onMessage;
    
    function onMessage(event) {
        console.log("onMessage");
        var task = JSON.parse(event.data);
        console.log(task);
        if (task.action === "add") {
            console.log("add action");
            if(task.isUrgent) addNewTask(task, urgentNewDiv);
            addNewTask(task, newTaskDiv);
        }
//        if (task.action === "remove") {
//            document.getElementById(task.id).remove();
//            //task.parentNode.removeChild(task);
//        }
//        if (task.action === "toggle") {
//            var node = document.getElementById(task.id);
//            var statusText = node.children[2];
//            if (task.status === "On") {
//                statusText.innerHTML = "Status: " + task.status + "§ (<a href=\"#\" OnClick=toggleDevice(" + task.id + ")>Turn off</a>)";
//            } else if (task.status === "Off") {
//                statusText.innerHTML = "Status: " + task.status + " (<a href=\"#\" OnClick=toggleDevice(" + task.id + ")>Turn on</a>)";
//            }
//        }
    }
    
    let taskData = {};
    const getUrl = window.location;
    const baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    const url = baseUrl + "/ws/task/dep/" + userObj.employee.department.id;
    
    let showUserData = function(user){
        let name = user.employee.firstName + " " + user.employee.lastName;
        userNameLi.textContent = name;
        depNameLi.textContent = user.employee.department.name;
    };
    
    let checkStatus = function(data){
        let result = "";
        if(data.completionUser){
            if(data.completionTime){
                result = "DONE";
            }else{
                result = "PROCESS";
            }
        }else{
            if(data.isCancelled){
                result = "CANCELED";
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
//        let crt = d.creationTime ? d.creationTime : "";
        let ct = d.completionTime ? convertTime(d.completionTime) : "";
//        let ct = d.completionTime ? d.completionTime : "";
        let cu = d.completionUser ? d.completionUser : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        let name = d.name ? d.name.toUpperCase() : "";
        console.log(name);
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
//        let crt = d.creationTime ? d.creationTime : "";
        let name = d.name ? d.name.toUpperCase() : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        let result = `
            <div class="task" id="${d.id}">
              <p class="task-name">${name}</p>
              <div class="buttons">
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
//        let crt = d.creationTime ? d.creationTime : "";
        let name = d.name ? d.name.toUpperCase() : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        let result = `
            <div class="task" id="${d.id}">
              <p class="task-name">${name}</p>
              <div class="buttons">
                <i class="fa fa-check-circle"></i>
              </div>
              <p>Place: <span>${loc}</span></p>
              <p>${crt}</p>
              <div class="down">
                <i class="fa fa-chevron-down"></i>
              </div>
              <div class="additional-info hidden">
                <p>Description: <span>${desc}</p>
                <p>Attachment: <span>${fl}</span></p>
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
//        console.log(displayNewTask(data));
        div.innerHTML = displayNewTask(data) + div.innerHTML;
    };
    
    let addProcessTask = function(data, div){
        div.innerHTML = div + displayProcessTask(data);
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
//        let DateArr = d.split("T");
//        let TimeArr = DateArr[1].substring(0, DateArr[1].length-6).split(".");
//        return TimeArr[0] + " " + DateArr[0];
//        let dateArr = d.split(" ");
//        return `${dateArr[0]} ${dateArr[1]} ${dateArr[2]} ${dateArr[5]} ${dateArr[3]}`;
        let dateArr = d.split(".");
        return dateArr[0];
    };
    
    logoutBtn.addEventListener("click", function(){
        localStorage.removeItem('userData');
        window.location.replace("../AppServer/index.html");
    });
    
    // Because FileReader is asynchronous, store its
    // result when it finishes to read the file
    reader.addEventListener("load", function () {
      file.binary = reader.result;
    });
    
    // At page load, if a file is already selected, read it.
    if(file.dom.files[0]) {
      reader.readAsBinaryString(file.dom.files[0]);
    }

    // If not, read the file once the user selects it.
    file.dom.addEventListener("change", function () {
      if(reader.readyState === FileReader.LOADING) {
        reader.abort();
      }

      reader.readAsBinaryString(file.dom.files[0]);
    });
    
    function sendData() {
        console.log(taskData);
        const formData = new FormData();
        for(let name in taskData){
            formData.append(name, taskData[name]);
        }
        console.log(file.dom.files[0]);
        formData.append("file", file.dom.files[0]);
        
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
//        console.log(taskData);
//        let posturl = baseUrl + "/ws/task?name=" + taskData.name + "&location=" + taskData.loc +
//                "&desc=" + taskData.desc + "&dep=" + taskData.dep + "&urgent=" + taskData.urgent;
//                            
//        const init = {
//            method: "POST",
//            body: JSON.stringify(taskData),
//            headers: {
//                "Content-type": "application/json; charset=UTF-8"
//            }
//        };
//        fetch(posturl, init)
//            .then(response => fetch(url+"/new"))
//                .then(response => response.text())
//                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
//                .then(data => xmlToJson(data))
//                .then(json => showNewTaskData(json, newTaskDiv))
//            .then(result => fetch(url+"/urgent/new"))
//                .then(response => response.text())
//                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
//                .then(data => xmlToJson(data))
//                .then(json => showNewTaskData(json, urgentNewDiv))
//            .then(result => fetch(url))
//                .then(response => response.text())
//                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
//                .then(data => xmlToJson(data))
//                .then(json => showTaskData(json, allTaskDiv))
//                .catch(error => console.log(error));
        console.log(taskData);
        sendData();
    });
    
    document.querySelector("#main").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-check-circle"){
            let id = e.target.parentNode.parentNode.id;
            let putUrl = baseUrl + "/ws/task/" + id + "/" + userObj.employee.userName;
            
            fetch(putUrl, {method: "PUT"})
                .then(response => fetch(url+"/process"))
                    .then(response => response.json())
                    .then(json => showProcessTaskData(json, processTaskDiv))
                .then(result => fetch(url+"/urgent/process"))
                    .then(response => response.json())
                    .then(json => showProcessTaskData(json, urgentProcessDiv))
                .then(result => fetch(url))
                    .then(response => response.json())
                    .then(json => showTaskData(json, allTaskDiv))
                    .catch(error => console.log(error));
        }
    });
    
    document.querySelector("#main").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-times-circle"){
            let id = e.target.parentNode.parentNode.id;
            let putUrl = baseUrl + "/ws/task/cancel/" + id;
            
            fetch(putUrl, {method: "PUT"})
                .then(response => fetch(url+"/cancelled"))
                    .then(response => response.json())
                    .then(json => showTaskData(json, canceledTaskDiv))
                .then(result => fetch(url))
                    .then(response => response.json())
                    .then(json => showTaskData(json, allTaskDiv))
                    .catch(error => console.log(error));
        }
    });
    
    document.querySelector("#process").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-check-circle"){
            let id = e.target.parentNode.parentNode.id;
            let putUrl = baseUrl + "/ws/task/" + id;
            
            fetch(putUrl, {method: "PUT"})
                .then(response => fetch(url+"/completed"))
                    .then(response => response.json())
                    .then(json => showTaskData(json, completedTaskDiv))
                .then(result => fetch(url))
                    .then(response => response.json())
                    .then(json => showTaskData(json, allTaskDiv))
                    .catch(error => console.log(error));
        }
    });
    
    showUserData(userObj);

    fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            showTaskData(json, allTaskDiv);
        })
//        .then(json => console.log(json))
        .catch(error => console.log(error));


    fetch(url+"/new")
        .then(response => response.json())
        .then(json => {
            console.log(json);
            showNewTaskData(json, newTaskDiv);})
//        .then(json => console.log(json))
        .catch(error => console.log(error));

        fetch(url+"/process")
        .then(response => response.json())
        .then(json => showProcessTaskData(json, processTaskDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));

    fetch(url+"/completed")
        .then(response => response.json())
        .then(json => showTaskData(json, completedTaskDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));

    fetch(url+"/cancelled")
        .then(response => response.json())
        .then(json => showTaskData(json, canceledTaskDiv))
        .catch(error => console.log(error));

    fetch(url+"/urgent/new")
        .then(response => response.json())
        .then(json => showNewTaskData(json, urgentNewDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));

    fetch(url+"/urgent/process")
        .then(response => response.json())
        .then(json => showProcessTaskData(json, urgentProcessDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));
    
});
