/* 
author @minhdao
 */
//import xmlToJson from 'xml2json';
document.addEventListener("DOMContentLoaded", function (event) {
    
    const userDiv = document.querySelector("#user");
    const allTaskDiv = document.querySelector("#allTask");
    const newTaskDiv = document.querySelector("#newTask .content");
    const processTaskDiv = document.querySelector("#inprocessTask .content");
    const completedTaskDiv = document.querySelector("#completedTask");
    const cancelledTaskDiv = document.querySelector("#cancelledTask");
    const urgentNew = document.querySelector("#newTask .urgent");
    const urgentProcess = document.querySelector("#inprocessTask .urgent");
    const addBtn = document.querySelector("#add");
    const addForm = document.querySelector("#addForm");
    const submitBtn = document.querySelector("#submitBtn");
    const checkBox = document.getElementById("checkBox");

    let userData = localStorage.getItem('userData');
//    localStorage.removeItem('userData');

    let userObj = JSON.parse(userData);
    console.log(userObj);
    
    let taskData = {};
    const getUrl = window.location;
    const baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    const url = baseUrl + "/ws/task/dep/" + userObj.employee.department.id;
    
    let showUserData = function(user){
        userDiv.innerHTML = `
            <h3>Personal Information</h3>
            <p>id: ${user.employee.id}</p>
            <p>firstname: ${user.employee.firstName}</p>
            <p>lastname: ${user.employee.lastName}</p>
            <p>department: ${user.employee.department.name}</p>
        `;
    };
    
    let showTaskData = function(data, div){
        if(data.tasks.task === undefined) return;
        else{
            if(data.tasks.task.length > 1){
                for(let d of data.tasks.task){
                    let desc = d.description ? d.description : "";
                    let ct = d.completionTime ? d.completionTime : "";
                    let cu = d.completionUser ? d.completionUser.firstName + " " + d.completionUser.lastName : "";
                    div.innerHTML += `
                        <p>name: ${d.name}</p>
                        <p>location: ${d.location}</p>
                        <p>description: ${desc}</p>
                        <p>creation time: ${d.creationTime}</p>
                        <p>completion time: ${ct}</p>
                        <p>completion user: ${cu}</p>
                        <hr>
                    `;
                }
            }else{
                let d = data.tasks.task;
                let desc = d.description ? d.description : "";
                let ct = d.completionTime ? d.completionTime : "";
                let cu = d.completionUser ? d.completionUser.firstName + " " + d.completionUser.lastName : "";
                div.innerHTML += `
                    <p>name: ${d.name}</p>
                    <p>location: ${d.location}</p>
                    <p>description: ${desc}</p>
                    <p>creation time: ${d.creationTime}</p>
                    <p>completion time: ${ct}</p>
                    <p>completion user: ${cu}</p>
                    <hr>
                `;
            }
        }
    };
    
    let addTask = function(data, div){
        console.log("add");
        let d = data.task;
        let desc = d.description ? d.description : "";
        let ct = d.completionTime ? d.completionTime : "";
        let cu = d.completionUser ? d.completionUser.firstName + " " + d.completionUser.lastName : "";
        div.innerHTML += `
            <p>name: ${d.name}</p>
            <p>location: ${d.location}</p>
            <p>description: ${desc}</p>
            <p>creation time: ${d.creationTime}</p>
            <p>completion time: ${ct}</p>
            <p>completion user: ${cu}</p>
            <hr>
        `;
    };
    
    addBtn.addEventListener("click", function(){
        if(addForm.style.display === "none"){
            addForm.style.display = "block";
            this.textContent = "Close";
        }else{
            addForm.style.display = "none";
            this.textContent = "Add task";
        }
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
    
    addForm.addEventListener("submit", function(e){
        e.preventDefault();
        console.log(taskData);
        let posturl = baseUrl + "/ws/task?name=" + taskData.name + "&location=" + taskData.loc +
                "&desc=" + taskData.desc + "&dep=" + taskData.dep + "&urgent=" + taskData.urgent;
                            
        const init = {
            method: "POST",
            body: JSON.stringify(taskData),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        };
        fetch(posturl, init)
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => xmlToJson(data))
            .then(json => {
                console.log(json);
                if(json.task.department.id === userObj.employee.department.id){
                    if(json.task.isUrgent === "true"){
                        addTask(json, urgentNew);
                    }else{
                        addTask(json, newTaskDiv);
                    }
                }
                addTask(json, allTaskDiv);
            })
            .catch(error => alert(error));

    });
    
    showUserData(userObj);
    
    fetch(url)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, allTaskDiv))
//        .then(json => console.log(json))
        .catch(error => alert(error));

    fetch(url+"/new")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, newTaskDiv))
//        .then(json => console.log(json))
        .catch(error => alert(error));

    fetch(url+"/inprocess")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, processTaskDiv))
//        .then(json => console.log(json))
        .catch(error => alert(error));

    fetch(url+"/completed")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, completedTaskDiv))
//        .then(json => console.log(json))
        .catch(error => alert(error));

    fetch(url+"/cancelled")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, cancelledTaskDiv))
//        .then(json => console.log(json))
        .catch(error => alert(error));
    
    fetch(url+"/urgent")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => {
            console.log(json);
            showTaskData(json, urgentNew);
        })
//        .then(json => console.log(json))
        .catch(error => alert(error));
    
});