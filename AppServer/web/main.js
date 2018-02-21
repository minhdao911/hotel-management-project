/* 
author @minhdao
 */
//import xmlToJson from 'xml2json';
document.addEventListener("DOMContentLoaded", function (event) {
    
    const userDiv = document.querySelector("#user");
    const allTaskDiv = document.querySelector("#allTask");
    const newTaskDiv = document.querySelector("#newTask");
    const processTaskDiv = document.querySelector("#inprocessTask");
    const completedTaskDiv = document.querySelector("#completedTask");
    const cancelledTaskDiv = document.querySelector("#cancelledTask");
    const addBtn = document.querySelector("#add");
    

    let userData = localStorage.getItem('userData');
    localStorage.removeItem('userData');

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
    
    showUserData(userObj);
    
    fetch(url)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, allTaskDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));

    fetch(url+"/new")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, newTaskDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));

    fetch(url+"/inprocess")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, processTaskDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));

    fetch(url+"/completed")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, completedTaskDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));

    fetch(url+"/cancelled")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json, cancelledTaskDiv))
//        .then(json => console.log(json))
        .catch(error => console.log(error));
    
});