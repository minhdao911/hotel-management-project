/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
document.addEventListener("DOMContentLoaded", function (event) {
//    const downBtn = document.querySelectorAll(".down");
//    const upBtn = document.querySelectorAll(".up");
    const checkNewBtn = document.querySelectorAll("#new .task .fa-check-circle");
    const cancelNewBtn = document.querySelectorAll("#new .task .fa-times-circle");
    const checkProcessBtn = document.querySelectorAll("#process .task .fa-check-circle");
    const closeBtn = document.querySelector("#close");
    const addBtn = document.querySelector("#add");
    const overlay = document.querySelector("#overlay");
    const newTaskDiv = document.querySelector("#new");
    const allTaskDiv = document.querySelector("#all");
    const completedTaskDiv = document.querySelector("#completed");
    const canceledTaskDiv = document.querySelector("#canceled");
    const processTaskDiv = document.querySelector("#process");
    const taskLis = document.querySelectorAll("#main-nav li");
    const submitBtn = document.querySelector("#submitBtn");
    
    document.querySelector("#main").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-chevron-down"){
            let downBtn = e.target;
            downBtn.parentNode.classList.toggle("hidden");
            downBtn.parentNode.nextElementSibling.classList.toggle("hidden");
            downBtn.parentNode.nextElementSibling.nextElementSibling.classList.toggle("hidden");
        }
    });
    
    document.querySelector("#main").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-chevron-up"){
            let upBtn = e.target;
            upBtn.parentNode.classList.toggle("hidden");
            upBtn.parentNode.previousElementSibling.classList.toggle("hidden");
            upBtn.parentNode.previousElementSibling.previousElementSibling.classList.toggle("hidden");
        }
    });
    
    document.querySelector("#main").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-check-circle"){
            let taskElem = e.target.parentNode.parentNode;
            taskElem.parentNode.removeChild(taskElem);
        }
    });
    
    document.querySelector("#main").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-times-circle"){
            let taskElem = e.target.parentNode.parentNode;
            taskElem.parentNode.removeChild(taskElem);
        }
    });
    
    document.querySelector("#process").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-chevron-down"){
            let downBtn = e.target;
            downBtn.parentNode.classList.toggle("hidden");
            downBtn.parentNode.nextElementSibling.classList.toggle("hidden");
            downBtn.parentNode.nextElementSibling.nextElementSibling.classList.toggle("hidden");
        }
    });
    
    document.querySelector("#process").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-chevron-up"){
            let upBtn = e.target;
            upBtn.parentNode.classList.toggle("hidden");
            upBtn.parentNode.previousElementSibling.classList.toggle("hidden");
            upBtn.parentNode.previousElementSibling.previousElementSibling.classList.toggle("hidden");
        }
    });
    
    document.querySelector("#process").addEventListener("click", function(e){
        if(e.target && e.target.className === "fa fa-check-circle"){
            let taskElem = e.target.parentNode.parentNode;
            taskElem.parentNode.removeChild(taskElem);
        }
    });

//    for(let i=0; i<downBtn.length; i++){
//      downBtn[i].addEventListener("click", function(){
//          console.log("down");
//        this.classList.toggle("hidden");
//        this.nextElementSibling.classList.toggle("hidden");
//        this.nextElementSibling.nextElementSibling.classList.toggle("hidden");
//      });
//    }

//    for(let i=0; i<upBtn.length; i++){
//      upBtn[i].addEventListener("click", function(){
//        this.classList.toggle("hidden");
//        this.previousElementSibling.classList.toggle("hidden");
//        this.previousElementSibling.previousElementSibling.classList.toggle("hidden");
//      });
//    }

    for(let i=0; i<checkNewBtn.length; i++){
      checkNewBtn[i].addEventListener("click", function(){
        let elem = this.parentNode.parentNode;
        elem.parentNode.removeChild(elem);
      });
    }

    closeBtn.addEventListener("click", function(){
      overlay.classList.add("hidden");
    });
    
    submitBtn.addEventListener("click", function(){
      overlay.classList.add("hidden");
    });

    addBtn.addEventListener("click", function(){
      overlay.classList.remove("hidden");
    });

    for(let i=0; i<taskLis.length; i++){
        taskLis[i].addEventListener("click", function(){
            for(let u=0; u<taskLis.length; u++){
              taskLis[u].classList.remove("chosen");
            }
            this.classList.add("chosen");
            switch(this.innerHTML){
              case 'All':
                allTaskDiv.classList.remove("hidden");
                newTaskDiv.classList.add("hidden");
                completedTaskDiv.classList.add("hidden");
                canceledTaskDiv.classList.add("hidden");
                break;
            case 'New':
                allTaskDiv.classList.add("hidden");
                newTaskDiv.classList.remove("hidden");
                completedTaskDiv.classList.add("hidden");
                canceledTaskDiv.classList.add("hidden");
                break;
            case 'Completed':
                allTaskDiv.classList.add("hidden");
                newTaskDiv.classList.add("hidden");
                completedTaskDiv.classList.remove("hidden");
                canceledTaskDiv.classList.add("hidden");
                break;
            case 'Canceled':
                allTaskDiv.classList.add("hidden");
                newTaskDiv.classList.add("hidden");
                completedTaskDiv.classList.add("hidden");
                canceledTaskDiv.classList.remove("hidden");
                break;
            }
        });
    }
});

