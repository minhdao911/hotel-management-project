/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

document.addEventListener("DOMContentLoaded", function (event) {

    const formsLis = document.querySelectorAll("#forms li");
    const formTask = document.querySelector("#form-task");
    const formUser = document.querySelector("#form-user");
    const closeBtn = document.querySelectorAll(".fa-times");
    const addTaskBtn = document.querySelector("#add .fa-plus-circle");
    const addUserBtn = document.querySelector("#add .fa-user-plus");
    const overlay = document.querySelector("#overlay");
    const submitBtn = document.querySelectorAll(".submitBtn");
    const overlayForms = document.querySelectorAll("#overlay div");
    const taskBtn = document.querySelector("#taskBtn");
    const userBtn = document.querySelector("#userBtn");
    const taskDiv = document.querySelector("#all");
    const userDiv = document.querySelector("#users");
    const depSelection = document.querySelector("#userDep");
    const titleSelection = document.querySelector("#title");
    const depSelectionS = document.querySelector("#userDepS");
    const titleSelectionS = document.querySelector("#titleS");

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

    for(let i=0; i<formsLis.length; i++){
      formsLis[i].addEventListener("click", function(){
        for(let u=0; u<formsLis.length; u++){
          formsLis[u].classList.remove("chosen");
        }
        this.classList.add("chosen");
        switch(this.innerHTML){
          case 'Add Task':
            formTask.classList.remove("hidden");
            formUser.classList.add("hidden");
          break;
        case 'Add User':
          formTask.classList.add("hidden");
          formUser.classList.remove("hidden");
         break;
        }
      });
    }

    for(let i=0; i<closeBtn.length; i++){
      closeBtn[i].addEventListener("click", function(){
        overlay.classList.add("hidden");
      });
    }


    for(let i=0; i<submitBtn.length; i++){
      submitBtn[i].addEventListener("click", function(){
        overlay.classList.add("hidden");
      });
    }

    addTaskBtn.addEventListener("click", function(){
      overlay.classList.remove("hidden");
      overlayForms[0].classList.remove("hidden");
      overlayForms[1].classList.add("hidden");
    });

    addUserBtn.addEventListener("click", function(){
      overlay.classList.remove("hidden");
      overlayForms[0].classList.add("hidden");
      overlayForms[1].classList.remove("hidden");
    });
    
    taskBtn.addEventListener("click", function(){
        this.classList.add("current");
        userBtn.classList.remove("current");
        taskDiv.classList.remove("hidden");
        userDiv.classList.add("hidden");
    });

    userBtn.addEventListener("click", function(){
        this.classList.add("current");
        taskBtn.classList.remove("current");
        userDiv.classList.remove("hidden");
        taskDiv.classList.add("hidden");
    });
    
    depSelection.addEventListener("change", function(){
        let dep = this.value;
        changeOption(dep, titleSelection);
    });
    
    depSelectionS.addEventListener("change", function(){
        let dep = this.value;
        changeOption(dep, titleSelectionS);
    });
    
    function changeOption(dep, div){
        switch(dep){
          case "1":
            div.innerHTML = `
              <option value="1">MANAGER</option>
            `;
            break;
          case "2":
            div.innerHTML = `
              <option value="2">RECEPTIONIST</option>
                <option value="3">HOUSEKEEPER</option>
                <option value="4">DOORPERSON</option>
                <option value="5">HOTEL ATTENDANT</option>
            `;
            break;
          case "3":
            div.innerHTML = `
              <option value="6">KITCHEN STAFF</option>
              <option value="7">CHEF</option>
            `;
            break;
          case "4":
            div.innerHTML = `
              <option value="8">ENGINEER</option>
            `;
            break;
        }
    }
});
