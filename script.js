let menu = document.querySelector(".menu-btn")
let sidebar = document.querySelector(".sidebar")
let menuIcon = document.querySelector(".menu-icon")


//sidebar toggle for mobile view
menu.addEventListener("click", ()=>{
    
    sidebar.classList.toggle("active")
    menuIcon.classList.toggle("close")
});

//setting toggle for desktop view

let setting = document.querySelector(".settings-menu")
let settingMenu = document.querySelector(".hid")
setting.addEventListener("click", ()=>{ 
    settingMenu.classList.toggle("open")
});

//setting toggle for mobile view

let Mobilesetting = document.getElementById("settings-menu")
let mobileMenuSetting = document.getElementById("hid")

Mobilesetting.addEventListener("click", ()=>{ 
       mobileMenuSetting.classList.toggle("open")
});