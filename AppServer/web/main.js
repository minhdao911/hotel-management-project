/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//import xmlToJson from 'xml2json';
document.addEventListener("DOMContentLoaded", function (event) {
    
    const userDiv = document.querySelector("#user");
    const taskDiv = document.querySelector("#task");

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
    
    let showTaskData = function(data){
        taskDiv.innerHTML = "<h3>All Tasks</h3>";
        for(let d of data.tasks.task){
            let desc = d.description ? d.description : "";
            let ct = d.completionTime ? d.completionTime : "";
            let cu = d.completionUser ? d.completionUser.firstName : "";
            taskDiv.innerHTML += `
                <p>name: ${d.name}</p>
                <p>location: ${d.location}</p>
                <p>description: ${desc}</p>
                <p>creation time: ${d.creationTime}</p>
                <p>completion time: ${ct}</p>
                <p>completion user: ${cu}</p>
                <br>
            `;
        }
    };
    
    showUserData(userObj);
    
    fetch(url)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => xmlToJson(data))
        .then(json => showTaskData(json))
        .catch(error => console.log(error));
    
});