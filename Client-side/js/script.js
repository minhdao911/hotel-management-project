
let taskArray = [];

let count = 0;

let activeNav = document.querySelector('.nav');

let navLi = document.querySelectorAll('.nav-links');

for (let i = 0; i < navLi.length; i++){
    navLi[i].addEventListener('click', function (e){
        e.preventDefault;
        
        let allLi = activeNav.children;
        
        for (let t = 0; t < allLi.length; t++){
            allLi[t].classList.contains('activeNav');
            
            let allLiCh = allLi[t].classList.contains('activeNav');
        
            allLi[t].removeAttribute('class');
            
        }
        
        e.target.parentElement.setAttribute('class', 'activeNav');
        
        switch (navLi[i].innerHTML){
            case 'All':
                document.querySelector("#task-list").style.display = "";
                document.querySelector("#task-list").style.visibility = "visible";
                document.querySelector("#new-tab-list").style.display = "none";
                document.querySelector("#cplt-tab-list").style.display = "none";
                document.querySelector("#cancel-tab-list").style.display = "none";
                break;
            case 'New':
                document.querySelector("#task-list").style.display = "none";
                document.querySelector("#new-tab-list").style.display = "";
                document.querySelector("#new-tab-list").style.visibility = "visible";
                document.querySelector("#cplt-tab-list").style.display = "none";
                document.querySelector("#cancel-tab-list").style.display = "none";
                break;
            case 'Completed':
                document.querySelector("#task-list").style.display = "none";
                document.querySelector("#new-tab-list").style.display = "none";
                document.querySelector("#cplt-tab-list").style.display = "";
                document.querySelector("#cplt-tab-list").style.visibility = "visible";
                document.querySelector("#cancel-tab-list").style.display = "none";
                break;
            case 'Cancelled':
                document.querySelector("#task-list").style.display = "none";
                document.querySelector("#new-tab-list").style.display = "none";
                document.querySelector("#cplt-tab-list").style.display = "none";
                document.querySelector("#cancel-tab-list").style.display = "";
                document.querySelector("#cancel-tab-list").style.visibility = "visible";
                break;
        }
        
    })
} //Toggle class activeNav between Navigation bar children elements

function getHour () {
    let day = new Date();
    
    let hour = day.getHours();
    if(hour < 10){
        hour = "0" + hour;
    }
    
    let minute = day.getMinutes();
    
    if(minute < 10) {
        minute = "0" + minute;
    }
    
    let currentHour = hour + ":" + minute;
    
    return currentHour;
} // Get current hour and minute

function getDate() {

    let day = new Date();
    
    let date = day.getDate();
    if(date < 10){
        date = '0'+date;
    }
    
    let month = day.getMonth();
    if(month < 10){
        month = "0" + month;
    }
    
    let year = day.getFullYear();
    
    let currentDate = date + '/' +month + '/' + year;
    
    return currentDate;
} // Get current day - month - year

function addButton (){
    document.getElementById("hidden-add-form").style.visibility = "visible";
    document.getElementById('urgent-btn').checked = false;
}; //The plus sign button that shows the form

function cancelButton(){
    document.getElementById("hidden-add-form").style.visibility= "hidden";
    document.getElementById("my-form").reset();
    
    document.getElementById('urgent-btn').checked = false;
}; // The X sign button that cancel add task in the form


 function previewFile(){
       var preview = document.querySelector('#output'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
       }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
           preview.style.visibility ="visible";
       } else {
           preview.src = "";
           preview.style.visibility ="hidden";
       }
}  // Function that allows uploader preview image in the task when it's uploaded

function addTask (){
    
    let ul = document.getElementById("list");
    let ulNew = document.getElementById("new-list");
    let urgent = document.getElementById("urgent-btn");
    let nameValue = document.querySelector("#task-name").value;
    let placeValue = document.querySelector("#task-place").value;
    let departmentValue = document.querySelector("#select").value;
    let desciptionValue = document.querySelector("#description").value;
    let image = document.querySelector('#output');
    image.style.visibility = "hidden";
    
    let imageValue = image.getAttribute('src');
    
    
    let li = document.createElement("li");
    
    if(urgent.checked){
        li.setAttribute("class", "urgent-task");
    }else{
        li.setAttribute("class", "task-on-list");
    }
    li.classList.add("task-on-" + count);
    
    
    if(nameValue != ""){
        let taskHeader = document.createElement("h3");
        taskHeader.setAttribute("id", "task-header");
        taskHeader.append((document.createTextNode(nameValue)));
        li.appendChild(taskHeader);
    }else{
        let taskHeader = document.createElement("h3");
        taskHeader.setAttribute("id", "task-header");
        taskHeader.append((document.createTextNode("Untitled")));
        li.appendChild(taskHeader);
    }
    
    
    if(placeValue != ""){
    let placeHeader = document.createElement("p");
    placeHeader.setAttribute("id", "place-header");
    let placeContent = document.createElement("strong");
    placeContent.append(document.createTextNode("Place: "));
    placeContent.setAttribute("class", "listItemHeader");
    placeHeader.append(placeContent);
    placeHeader.append(document.createTextNode(placeValue));
    li.appendChild(placeHeader);
    }

    if(departmentValue != ""){
    let departmentHeader = document.createElement("p");
    departmentHeader.setAttribute("id", "department-header");
    let departmentContent = document.createElement("strong");
    departmentContent.append(document.createTextNode("Department: "));
    departmentContent.setAttribute("class", "listItemHeader");
    departmentHeader.append(departmentContent);
    departmentHeader.append(document.createTextNode(departmentValue));
    li.appendChild(departmentHeader);
    }
    
    if (desciptionValue !== ""){
    let descriptionHeader = document.createElement("p");
    descriptionHeader.setAttribute("id", "department-header");
    let descriptionContent = document.createElement("strong");
    descriptionContent.append(document.createTextNode("Description: "));
    descriptionContent.setAttribute("class", "listItemHeader");
    descriptionHeader.append(descriptionContent);
    descriptionHeader.append(document.createTextNode(desciptionValue));
    li.appendChild(descriptionHeader);
    }
    
    if(imageValue != ""){
    let attachmentHeader = document.createElement("p");
    attachmentHeader.setAttribute("id", "attachment-header");
    let attachmentContent = document.createElement("strong");
    attachmentContent.append(document.createTextNode("Attachment:"));
    attachmentContent.setAttribute("class", "listItemHeader");
    attachmentHeader.append(attachmentContent);
    let lineBreak = document.createElement("br");
    attachmentHeader.append(lineBreak);
    let attachImage = document.createElement("img");
    attachImage.setAttribute("class", "task-image");
    attachImage.setAttribute("src", imageValue);
    attachmentHeader.append(attachImage);
    li.append(attachmentHeader);
    image.setAttribute('src','');
    }
    
    let crossButton = document.createElement("button");
    crossButton.setAttribute("class","task-list-btn-cross");
    crossButton.innerHTML = "&#10008";
    li.append(crossButton);
    crossButton.onclick = cancelTask;
    
    let checkedButton = document.createElement("button");
    checkedButton.setAttribute("class","task-list-btn-check");
    checkedButton.innerHTML = "&#10004";
    li.append(checkedButton);
    checkedButton.onclick = takeTask;
    
    let taskTime = document.createElement("p");
    taskTime.setAttribute("class", "task-time");
    let taskHour = document.createElement("strong");
    taskHour.setAttribute("class", "current-hour");
    let currentHour = getHour();
    taskHour.append(document.createTextNode(currentHour));
    let taskDate = getDate();
    taskTime.append(taskHour);
    taskTime.append(" ");
    taskTime.append(document.createTextNode(taskDate));
    li.append(taskTime);
    
    let newLi = li.cloneNode(true);
    let newCrossButton = newLi.querySelector(".task-list-btn-cross");
    let newCheckButton = newLi.querySelector(".task-list-btn-check");
    newCrossButton.onclick = cancelTask;
    newCheckButton.onclick = takeTask;
    
    
    let waitingTask = ul.querySelector("#waiting-task");
    waitingTask.insertBefore(li, waitingTask.childNodes[0]);
    
    ulNew.insertBefore(newLi, ulNew.childNodes[0]);
    
    taskArray.push(li);
    
    count = count + 1;
    
    cancelButton();
    
};  // Submit form function that add other info to task list as a list item

function takeTask (e) {
    
  
    let checkClass = e.target.parentElement.classList;
    let checkBack = checkClass.item(1);
    
    let ulNew = document.getElementById("new-list");
    let checkNewList = ulNew.children;
    
    for (let a = 0; a < checkNewList.length; a++){
    
        let newListClass = checkNewList[a].classList;
        
        if(newListClass.contains(checkClass.item(1))){
            ulNew.removeChild(checkNewList[a]);
        }
    }
    
    let ulAll = document.getElementById("list");
    let checkAllList = ulAll.children;
    
    for (let b = 0; b < checkAllList.length; b++){
    
        let newListClass = checkAllList[b].classList;
        
        if(newListClass.contains(checkClass.item(1))){
            ulAll.removeChild(checkAllList[b]);
            break;
        }
    }   
    
    
     //e.target.parentElement.removeAttribute("class");       //e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    
     let procList = document.getElementById("in-process-list");
     procList.appendChild(e.target.parentElement);
    
     e.target.parentElement.setAttribute("class", "task-in-process");
    let procListItem = e.target.parentElement;
    
    
    function delOldTime (){
        let oldTime = procListItem.querySelector('.task-time');
        procListItem.removeChild(oldTime);
    }
    
    function getNewButtons () {
        let crossButton = procListItem.querySelector(".task-list-btn-cross");
        let checkButton = procListItem.querySelector(".task-list-btn-check");
        procListItem.removeChild(crossButton);
        procListItem.removeChild(checkButton);
    }
    
    
    let doneButton = document.createElement("button");
    doneButton.setAttribute("class","done-btn");
    doneButton.innerHTML = "done";
    e.target.parentElement.append(doneButton);
    doneButton.onclick = doneTask;
    
    
    let taskTime = document.createElement("p");
    taskTime.setAttribute("class", "task-time-taken");
    let taskHour = document.createElement("strong");
    taskHour.setAttribute("class", "current-hour");
    let currentHour = getHour();
    taskHour.append(document.createTextNode(currentHour));
    let taskDate = getDate();
    taskTime.append(taskHour);
    taskTime.append(" ");
    taskTime.append(document.createTextNode(taskDate));
    e.target.parentElement.append(taskTime);
    
    
    
    getNewButtons();
    delOldTime ();
} // function of check button to move the task to In Process list

function cancelTask (e) {
    
    let checkClass = e.target.parentElement.classList;
    let checkBack = checkClass.item(1);
    
    let ulNew = document.getElementById("new-list");
    let checkNewList = ulNew.children;
    
    for (let a = 0; a < checkNewList.length; a++){
    
        let newListClass = checkNewList[a].classList;
        
        if(newListClass.contains(checkClass.item(1))){
            ulNew.removeChild(checkNewList[a]);
        }
    }
    
    let ulAll = document.getElementById("list");
    let checkAllList = ulAll.children;
    
    for (let b = 0; b < checkAllList.length; b++){
    
        let newListClass = checkAllList[b].classList;
        
        if(newListClass.contains(checkClass.item(1))){
            ulAll.removeChild(checkAllList[b]);
            break;
        }
    }   
    
    //e.target.parentElement.removeAttribute("class");
    //e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    
    let procList = document.getElementById("cancel-list");
    procList.appendChild(e.target.parentElement);
    
    e.target.parentElement.setAttribute("class", "task-cancelled");
    let procListItem = e.target.parentElement;
    
    
    function delOldTime (){
        let oldTime = procListItem.querySelector('.task-time');
        
        procListItem.removeChild(oldTime);
        
    
    }
    
    function getNewButtons () {
    
        let crossButton = procListItem.querySelector(".task-list-btn-cross");
        let checkButton = procListItem.querySelector(".task-list-btn-check");
    
        procListItem.removeChild(crossButton);
        procListItem.removeChild(checkButton);
    }
    
    
    let cancelNot = document.createElement("p");
    cancelNot.setAttribute("class", 'cancel-not');
    cancelNot.append(document.createTextNode("Cancel"));
    e.target.parentElement.append(cancelNot);
    
    
    let taskTime = document.createElement("p");
    taskTime.setAttribute("class", "task-time-taken");
    let taskHour = document.createElement("strong");
    taskHour.setAttribute("class", "current-hour");
    let currentHour = getHour();
    taskHour.append(document.createTextNode(currentHour));
    let taskDate = getDate();
    taskTime.append(taskHour);
    taskTime.append(" ");
    taskTime.append(document.createTextNode(taskDate));
    e.target.parentElement.append(taskTime);
    
    getNewButtons();
    delOldTime ();
} // function of cancel button to cancel the task

function doneTask (e) {
    
    let target = e.target.parentElement;
    e.target.parentElement.removeAttribute("class");
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    let procList = document.getElementById("list");
    let compList = document.getElementById('cplt-list');
    
    let duplicate = e.target.parentElement.cloneNode(true);
    duplicate.setAttribute('class', 'task-done');
    
    compList.insertBefore(duplicate, compList.childNodes[0]);
    
    let finishedTask = procList.querySelector("#finished-task");
    
    finishedTask.insertBefore(e.target.parentElement, finishedTask.childNodes[0]);
    
    e.target.parentElement.setAttribute("class", "task-done");
    
    function delProcTime () {
        
        
        let check = target.hasChildNodes('.task-time-taken');
        
        let oldTime = target.querySelector('.task-time-taken');
        
        target.removeChild(oldTime);
        
        let check1 = duplicate.hasChildNodes('.task-time-taken');
        
        let oldTime1 = duplicate.querySelector('.task-time-taken');
        
        duplicate.removeChild(oldTime1);
    }
    
    
    
    function delDoneBtn () {
        let procListItem = e.target.parentElement;
        let doneBtn = procListItem.querySelector(".done-btn");
        
        let procListItem1 = duplicate;
        let doneBtn1 = procListItem1.querySelector(".done-btn");
        
        procListItem.removeChild(doneBtn);
        procListItem1.removeChild(doneBtn1);
    }
    
   
    let doneNot = document.createElement("p");
    doneNot.setAttribute("class", 'done-not');
    doneNot.append(document.createTextNode("Done"));
    e.target.parentElement.append(doneNot);
    let doneNot1 = doneNot.cloneNode(true);
    duplicate.append(doneNot1);
    
    
    let taskTime = document.createElement("p");
    taskTime.setAttribute("class", "task-time-done");
    let taskHour = document.createElement("strong");
    taskHour.setAttribute("class", "current-hour");
    let currentHour = getHour();
    taskHour.append(document.createTextNode(currentHour));
    let taskDate = getDate();
    taskTime.append(taskHour);
    taskTime.append(" ");
    taskTime.append(document.createTextNode(taskDate));
    let taskTime1 = taskTime.cloneNode(true);
    taskTime1.setAttribute('class', 'task-time-done');
    e.target.parentElement.append(taskTime);
    duplicate.append(taskTime1);
    
    
    delDoneBtn ();
    delProcTime ();
} // function of DONE button to move to task to completed task list


previewFile(); 
