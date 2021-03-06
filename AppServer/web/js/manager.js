/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let userData = localStorage.getItem('userData');

if(userData === null){
    alert("Something went wrong, please login again!");
    window.location.replace("../index.html");
}

document.addEventListener("DOMContentLoaded", function (event) {
    const userNameLi = document.querySelector("#userName");
    const depNameLi = document.querySelector("#depName");
    const userTitleLi = document.querySelector("#userTitle");
    const allTaskDiv = document.querySelector("#all .content");
    const userDiv = document.querySelector("#users table");
    const logoutBtn = document.querySelector("#logoutBtn");
    const taskForm = document.querySelector("#form-task");
    const userForm = document.querySelector("#form-user");
    const taskFormS = document.querySelector("#form-task-smallscreen");
    const userFormS = document.querySelector("#form-user-smallscreen");
    const checkBox = document.querySelectorAll(".checkBox");
    const loader = document.querySelector(".loader");
    const pswForm = document.querySelector("#pswForm");

    let userObj = JSON.parse(userData);
    console.log(userObj);
    
    let taskFormData = {
        userId: userObj.employee.id,
        userName: userObj.employee.userName
    };
    
    let userFormData = {};
    
    let taskData = {};
    
    let newPass = "";
    
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + "//" + getUrl.host;
    const url = baseUrl + "/ws/task";
    const wsUrl = "wss://" + getUrl.host + "/actions/" + userObj.employee.department.id;
    
    var socket = new WebSocket(wsUrl);
    socket.onmessage = onMessage;
    
    function onMessage(event) {
        console.log("onMessage");
        var task = JSON.parse(event.data);
        loader.style.display = "flex";
        getTasks();
    }
    
    let showUserData = function(user){
        let name = user.employee.firstName + " " + user.employee.lastName;
        userNameLi.textContent = name;
        depNameLi.textContent = user.employee.department.name;
        userTitleLi.textContent = user.employee.employeeTitle.name;
    };
    
    let checkStatus = function(data){
        let result = "";
        if(data.isCancelled === "true"){
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
    
    let checkImgAttachment = function(data){
        let fileType = data.fileName.substring(data.fileName.length-3);
        if(fileType === "png" || fileType === "jpg" || fileType === "gif"){
            return `<img src="data:image/png;base64,${data.fileData}">`;
        }
        return "";
    };
    
    let convertTime = function(d){
        let DateArr = d.split("T");
        let TimeArr = DateArr[1].split("Z")[0].split(".");
        return TimeArr[0] + " " + DateArr[0];
    };
    
    let displayTask = function(d){
        let desc = d.description ? d.description : "";
        let loc = Object.keys(d.location).length !== 0 ? d.location.replace(/\b\w/g, l => l.toUpperCase()) : "";
        let crt = d.creationTime ? convertTime(d.creationTime) : "";
        let ct = d.completionTime ? `<p>${convertTime(d.completionTime)}</p>` : "";
        let cu = d.completionUser ? d.completionUser : "";
        let fl = d.fileName ? "<a href=http://teampower.fun/download?id="+ d.fileId + ">" + d.fileName + "</a>" : "";
        let img = d.filePath ? checkImgAttachment(d) : "";
        let name = d.name ? d.name.toUpperCase() : "";
        let status = checkStatus(d);
        let creationUser = d.creationUser ? d.creationUser.firstName + " " + d.creationUser.lastName : "";
        let completionUser = d.completionUser ? d.completionUser.firstName + " " + d.completionUser.lastName : "";
        let dep = d.department.name.replace(/\b\w/g, l => l.toUpperCase());
        let usr = "";
        if(status === "PROCESS"){
            usr = `<p>Processed By: <span>${completionUser}</span></p>`;
        }else if(status === "DONE"){
            usr = `<p>Completed By: <span>${completionUser}</span></p>`;
        }else if(status === "CANCELED"){
            if(completionUser !== "")
                usr = `<p>Canceled By: <span>${completionUser}</span></p>`;
            else
                usr = `<p>Canceled By: <span>${creationUser}</span></p>`;
        }
        let result =  `
            <div class="task">
              <p class="task-name">${name}</p>
              <div class="label ${status.toLowerCase()}-label">
                ${status}
              </div>
              <p>Place: <span>${loc}</span></p>
              <p>${crt}</p>
              ${ct}
              <div class="tasker">
                <p>Department: <span>${dep}</span></p>
                <p>Created By: <span>${creationUser}</span></p>
                ${usr}
              </div>
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
    
    let showTaskData = function(data, div){
        div.innerHTML = "";
        if(data.tasks.task === undefined) return;
        else{
            if(data.tasks.task.length > 1){
                for(let i=data.tasks.task.length-1; i>-1; i--){
                    let d = data.tasks.task[i];
                    div.innerHTML += displayTask(d);
                }
            }else{
                let d = data.tasks.task;
                div.innerHTML += displayTask(d);
            }
        }
    };
    
    let displayUser = function(d){
        let result = `
            <tr>
                <td>${d.firstName}</td>
                <td>${d.lastName}</td>
                <td>${d.department.name.replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td>${d.employeeTitle.name.replace(/\b\w/g, l => l.toUpperCase())}</td>
            </tr>
        `;
        return result;
    };
    
    let showUsers = function(data, div){
        div.innerHTML = `
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Title</th>
            </tr>
        `;
        if(data.employees.employee === undefined) return;
        else{
            if(data.employees.employee.length > 1){
                for(let d of data.employees.employee){
                    div.innerHTML += displayUser(d, div);
                }
            }
            else{
                let d = data.employees.employee;
                div.innerHTML += displayUser(d, div);
            }
        }
    };
    
    logoutBtn.addEventListener("click", function(){
        localStorage.removeItem('userData');
        window.location.replace("../index.html");
    });
    
    for(let i=0; i<checkBox.length; i++){
        checkBox[i].addEventListener("click", function(){
            if(this.checked) taskFormData.urgent = true;
            else taskFormData.urgent = false;
        });
    }
    
    taskForm.addEventListener("input", function(){
        getTaskData(taskForm);
    });
    
    taskFormS.addEventListener("input", function(){
        getTaskData(taskFormS);
    });
    
    userForm.addEventListener("input", function(){
        getUserData(userForm);
    });
    
    userFormS.addEventListener("input", function(){
        getUserData(userFormS);
    });
    
    taskForm.addEventListener("submit", function(e){
        e.preventDefault();
        sendTaskData(taskFormData, taskForm);
        this.reset();
    });
    
    taskFormS.addEventListener("submit", function(e){
        e.preventDefault();
        sendTaskData(taskFormData, taskFormS);
        this.reset();
    });
    
    userForm.addEventListener("submit", function(e){
        e.preventDefault();
        sendUserData(userFormData);
        this.reset();
    });
    
    userFormS.addEventListener("submit", function(e){
        e.preventDefault();
        sendUserData(userFormData);
        this.reset();
    });
    
    function getTaskData(form){
        taskFormData.name = form.querySelector("input[name='name']").value;
        taskFormData.location = form.querySelector("input[name='location']").value;
        taskFormData.desc = form.querySelector("textarea[name='desc']").value;
        taskFormData.dep = form.querySelector("select[name='dep']").value;
        taskFormData.urgent = false;
    }
    
    function getUserData(form){
        userFormData.firstName = form.querySelector("input[name='fn']").value;
        userFormData.lastName = form.querySelector("input[name='ln']").value;
        userFormData.dep = form.querySelector("select[name='dep']").value;
        switch(userFormData.dep){
            case "1":
                userFormData.title = "1";
                break;
            case "2":
                userFormData.title = "2";
                break;
            case "3":
                userFormData.title = "6";
                break;
            case "4":
                userFormData.title = "8";
                break;
        }
        console.log(userFormData);
    }
    
    userFormS.querySelector("select[name='title']").addEventListener("change", function(){
        userFormData.title = this.value;
        console.log(userFormData);
    });
    
    userForm.querySelector("select[name='title']").addEventListener("change", function(){
        userFormData.title = this.value;
        console.log(userFormData);
    });
    
    function sendTaskData(data, form) {
        const formData = new FormData();
        for(let name in data){
            formData.append(name, data[name]);
        }
        const file = form.querySelector("input[name='file']");
        formData.append("file", file.files[0]);
        
//        console.log(formData);
        
        fetch(baseUrl+"/upload", {
            method: "POST",
            body: formData
        }).then(response => console.log(response));
    }
    
    function sendUserData(data){
        let fn = userFormData.firstName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        let ln = userFormData.lastName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        let dep = userFormData.dep;
        let title = userFormData.title;
        
        let userUrl = baseUrl + `/ws/employee/${fn}/${ln}/${dep}/${title}`;
        
        fetch(userUrl, {
            method: "POST"
        })
            .then(response => fetch(baseUrl+"/ws/employee"))
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => xmlToJson(data))
            .then(json => {
                console.log(json);
                showUsers(json, userDiv);
            })
            .catch(error => console.log(error));
    }
    
    function getTasks(){
        fetch(url)
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => xmlToJson(data))
            .then(json => {
                taskData = json;
                console.log("taskData");
                console.log(taskData);
            })
            .then(res => fetch(baseUrl+"/ws/attachment"))
                .then(response => response.text())
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                .then(data => xmlToJson(data))
                .then(json => {
                    console.log("attachments");
                    console.log(json);
                    let attachments = json.attachments.attachment;
                    console.log(taskData);
                    if(attachments === undefined) return;
                    if(attachments.length > 1){
                        for(let a of attachments){
                            taskData.tasks.task[a.task.id-1].fileName = a.fileName;
                            taskData.tasks.task[a.task.id-1].fileId = a.id;
                            taskData.tasks.task[a.task.id-1].fileData = a.fileData;
                        }
                    }else{
                        if(taskData.tasks.task.length > 1){
                            taskData.tasks.task[attachments.task.id-1].fileName = attachments.fileName;
                            taskData.tasks.task[attachments.task.id-1].fileId = attachments.id;
                            taskData.tasks.task[attachments.task.id-1].fileData = attachments.fileData;
                        }else{
                            taskData.tasks.task.fileName = attachments.fileName;
                            taskData.tasks.task.fileId = attachments.id;
                            taskData.tasks.task.fileData = attachments.fileData;
                        }
                    }
                    console.log(taskData);
                })
                .then(res => {
                    loader.style.display = "none";
                    showTaskData(taskData, allTaskDiv);
                })
            .catch(error => console.log(error));
    }
    
    document.querySelector("input[name='oldpsw']").addEventListener("input", function(){
        let pass = this.value;
        if(pass === userObj.employee.password){
          this.classList.add("correct");
          this.classList.remove("wrong");
        }else{
          this.classList.remove("correct");
          this.classList.add("wrong");
        }
    });

    document.querySelector("input[name='newpsw']").addEventListener("input", function(){
        newPass = this.value; 
    });

    document.querySelector("input[name='verifypsw']").addEventListener("input", function(){
        let pass = this.value;
        if(pass === newPass){
          this.classList.add("correct");
          this.classList.remove("wrong");
        }else{
          this.classList.remove("correct");
          this.classList.add("wrong");
        }
    });

    pswForm.addEventListener("submit", function(e){
        e.preventDefault();
        if(document.querySelector("input[name='oldpsw']").classList.contains("wrong") || 
                document.querySelector("input[name='verifypsw']").classList.contains("wrong")){
          document.querySelector("#pswDiv p").classList.remove("hidden");
        }else{
          document.querySelector("#pswDiv p").classList.add("hidden");
          
          let putUrl = baseUrl+`/ws/employee/${userObj.employee.id}/${newPass}`;
          
          fetch(putUrl, {method: "PUT"})
            .then(response => console.log(response))
            .then(res => pswForm.reset())
            .catch(error => console.log(error));
        }
    });
    
    showUserData(userObj);
    
    getTasks();
    
    fetch(baseUrl+"/ws/employee")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => {
            console.log(json);
            showUsers(json, userDiv);
        })
        .catch(error => console.log(error));
    
});
