/* 
author @minhdao
 */

document.addEventListener("DOMContentLoaded", function (event) {
    let loginForm = document.querySelector("#loginForm");
    let submitBtn = document.querySelector("#submitBtn");
    
    let userData = {};
    const getUrl = window.location;
    const baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    
    let storeData = function(data){
        localStorage.setItem('userData', data);
    };
    
    loginForm.addEventListener("input", function(){
        const username = loginForm.querySelector("input[name='username']").value;
        const password = loginForm.querySelector("input[name='password']").value;
        userData.username = username;
        userData.password = password;
    });
    
    submitBtn.addEventListener("click", function(){
        console.log(userData);
        console.log("click");
        const init = {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        };
        let url = baseUrl+"/ws/employee/login/"+userData.username+"/"+userData.password;

        fetch(url, init)
//                .then(response => console.log(response))
                .then(response => {
                    if(response.status === 204){
                        return Promise.reject('Wrong username or password');
                    }else{
                        return response.text();
                    }     
                })
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                .then(data => xmlToJson(data))
                .then(json => storeData(JSON.stringify(json)))
                .then(res => window.location.replace("../AppServer/main.html"))
                .catch(error => alert(error));
    });  
});