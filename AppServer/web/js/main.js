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
    
//    console.log(urgentNewDiv);
    
    let userData = localStorage.getItem('userData');
//    localStorage.removeItem('userData');

    let userObj = JSON.parse(userData);
    console.log(userObj);
    
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
    
    let displayTask = function(d, div){
        let desc = d.description ? d.description : "";
        let loc = d.location ? d.location.replace(/\b\w/g, l => l.toUpperCase()) : "";
        let crt = d.creationTime ? convertTime(d.creationTime) : "";
        let ct = d.completionTime ? convertTime(d.completionTime) : "";
        let cu = d.completionUser ? d.completionUser : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        let name = d.name ? d.name.toUpperCase() : "";
        console.log(name);
        let status = checkStatus(d);
        div.innerHTML += `
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
    };
    
    let displayNewTask = function(d, div){
        let desc = d.description ? d.description : "";
        let loc = d.location ? d.location.replace(/\b\w/g, l => l.toUpperCase()) : "";
        let crt = d.creationTime ? convertTime(d.creationTime) : "";
        let name = d.name ? d.name.toUpperCase() : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        div.innerHTML += `
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
    };
    
    let displayProcessTask = function(d, div){
        let desc = d.description ? d.description : "";
        let loc = d.location ? d.location.replace(/\b\w/g, l => l.toUpperCase()) : "";
        let crt = d.creationTime ? convertTime(d.creationTime) : "";
        let name = d.name ? d.name.toUpperCase() : "";
        let fl = d.fileLink ? "<a href="+ d.fileLink + ">" + d.fileName + "</a>" : "";
        div.innerHTML += `
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
    };
    
    let showTaskData = function(data, div){
        div.innerHTML = "";
        if(data.length > 1){
            for(let d of data){
                displayTask(d, div);
            }
        }else if (data.length === 1){
            let d = data[0];
            displayTask(d, div);
        }
    };
    
    let showNewTaskData = function(data, div){
        div.innerHTML = "";
        if(data.length > 1){
            for(let d of data){
                displayNewTask(d, div);
            }
        }else if (data.length === 1){
            let d = data[0];
            displayNewTask(d, div);
        }
    };
    
    let showProcessTaskData = function(data, div){
        div.innerHTML = "";
        if(data.length > 1){
            for(let d of data){
                displayProcessTask(d, div);
            }
        }else if (data.length === 1){
            let d = data[0];
            displayProcessTask(d, div);
        }
    };
    
    let convertTime = function(d){
        let DateArr = d.split("T");
        let TimeArr = DateArr[1].substring(0, DateArr[1].length-6).split(".");
        return TimeArr[0] + " " + DateArr[0];
    };
    
    logoutBtn.addEventListener("click", function(){
        localStorage.removeItem('userData');
        window.location.replace("../AppServer/index.html");
    });
    
    addForm.addEventListener("input", function(){
        taskData.name = addForm.querySelector("input[name='name']").value;
        taskData.loc = addForm.querySelector("input[name='location']").value;
        taskData.desc = addForm.querySelector("textarea[name='desc']").value;
        taskData.dep = addForm.querySelector("select[name='dep']").value;
        taskData.urgent = false;
    });
    
    checkBox.addEventListener("click", function(){
        if(this.checked) taskData.urgent = true;
        else taskData.urgent = false;
    });
    
//    addForm.addEventListener("submit", function(e){
//        e.preventDefault();
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
//    });
    
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
