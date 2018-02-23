let taskArray = [];

function addButton (){
    document.getElementById("hidden-add-form").style.visibility = "visible";
}

function cancelButton(){
    document.getElementById("hidden-add-form").style.visibility= "hidden";
}

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
}

function addTask (){
    
    let ul = document.getElementById("list");
   
    let nameValue = document.querySelector("#task-name").value;
    let placeValue = document.querySelector("#task-place").value;
    let departmentValue = document.querySelector("#select").value;
    let desciptionValue = document.querySelector("#description").value;
    let attachmentValue = document.querySelector("#fileToUpload").value;
    
    let li = document.createElement("li");
    li.setAttribute("class", "task-on-list");
    
    let taskHeader = document.createElement("h2");
    taskHeader.setAttribute("id", "task-header");
    taskHeader.append((document.createTextNode(nameValue)));
    li.appendChild(taskHeader);
    
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
    
    let attachmentHeader = document.createElement("p");
    attachmentHeader.setAttribute("id", "attachment-header");
    let attachmentContent = document.createElement("strong");
    attachmentContent.append(document.createTextNode("Attachment: "));
    attachmentContent.setAttribute("class", "listItemHeader");
    attachmentHeader.append(attachmentContent);
    attachmentHeader.append(document.createTextNode(attachmentValue));
    
    let crossButton = document.createElement("button");
    crossButton.setAttribute("id","cross-btn");
    crossButton.innerHTML = "&#10008";
    li.append(crossButton);
    crossButton.onclick = cancelTask;
    
    let checkedButton = document.createElement("button");
    checkedButton.setAttribute("id","checked-btn");
    checkedButton.innerHTML = "&#10004";
    li.append(checkedButton);
    checkedButton.onclick = takeTask;
    

    ul.appendChild(li);
    taskArray.push(li);
    
    cancelButton();
};


function takeTask (e) {
    
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    let procList = document.getElementById("in-process-list");
    procList.appendChild(e.target.parentElement);
    e.target.parentElement.className = "task-in-process";
    
}

function cancelTask (e) {
    
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    let cancelList = document.getElementById("cancel-list");
    cancelList.appendChild(e.target.parentElement);
    e.target.parentElement.className = "task-cancelled";
    
}


previewFile(); 
