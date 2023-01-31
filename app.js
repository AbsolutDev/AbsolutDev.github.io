//Assign event handlers to navigation menu
document.getElementById("header").onmouseover = navMenuMouseOverEventHander;
document.getElementById("header").onmouseout = navMenuMouseOutEventHander;

//Assign event handlers to screenshots overlay control buttons
document.getElementById("screenshots-close").onclick = screenshotCloseClickEventHandler;
document.getElementById("screenshots-skip-left").onclick = screenshotsSkipLeftClickEventHandler;
document.getElementById("screenshots-skip-right").onclick = screenshotsSkipRightClickEventHandler;

//
document.getElementById("form-submit").onclick = (event) => {
  event.preventDefault();
  alert(document.getElementById("form-name").value);
}

//Global variables assignment
let pages = document.getElementsByClassName("page");
let screenshotPages = document.getElementsByClassName("screenshots-overlay");
let currentScreenshot;
let projectName;
let screenshotScreens;

//Set #name and #title positions in pixels
document.getElementById("name").style.paddingRight = document.getElementById("name").clientWidth + "px";
document.getElementById("title").style.paddingLeft = document.getElementById("title").clientWidth + "px";

//Assign click event handler to navigation menu items
let menuItems = document.getElementsByClassName("nav-menu-item");
for (let i=0;i<menuItems.length;i++) {
  menuItems[i].onclick = navMenuItemClickEventHandler;
}

///Assign click event handler to .screenshotLink elements
let screenshotLinks = document.getElementsByClassName("screenshot-link");
for (let i=0;i<screenshotLinks.length;i++) {
  screenshotLinks[i].onclick = screenshotLinksClickEventHandler;
}

//Initiate intro animation 1s after load
setTimeout(() => {
  document.getElementById("name").style.transitionDuration = "1s";
  document.getElementById("title").style.transitionDuration = "1s";
  document.getElementById("name").style.paddingRight = 0;
  document.getElementById("title").style.paddingLeft = 0;
  document.getElementById("title-hr").style.transform = "rotate(0deg)";
  document.getElementById("header").style.top = "0";
  document.getElementById("title-hr").style.width = "50%";
  document.getElementById("title-hr").style.left = "25%";
  document.getElementById("nav-menu").style.opacity = "1";
  setTimeout(() => {
    //Display Home Page and Footer
    document.getElementById("home-page").className = "page active";
    document.getElementById("contact-section").style.display = "flex";
    setTimeout(() => {
      document.getElementById("contact-section").style.opacity = "1";
      }, 100);
    }, 1000);
  }, 1000 /*2500*/);

//Mouse over event handler for the Navigation Menu
function navMenuMouseOverEventHander() {
  if (document.getElementById("nav-menu").style.opacity === "1") {
    for (let i=0;i<menuItems.length;i++) {
      if (menuItems[i].className === "nav-menu-item hidden") {
        menuItems[i].className = "nav-menu-item";
      }
    }
  }
}

//Mouse out event handler for the Navigation Menu
function navMenuMouseOutEventHander() {
  if (document.getElementById("nav-menu").style.opacity === "1") {
    for (let i=0;i<menuItems.length;i++) {
      if (menuItems[i].className !== "nav-menu-item active") {
        menuItems[i].className="nav-menu-item hidden";
      }
    }
  }
}

//Click event handler for Navigation Menu items
function navMenuItemClickEventHandler(e) {
  const pageToDisplay = e.target.innerHTML;
  if (document.getElementById(pageToDisplay.toLowerCase() + "-page").className !== "page active") {
    for (let i=0;i<pages.length;i++) {
      if (pages[i].className === "page active") {
        pages[i].className = "page hidden";
        menuItems[i].className="nav-menu-item";
        e.target.parentNode.className = "nav-menu-item active";
        document.getElementById("contact-section").style.opacity = "0";
        setTimeout(() => {
          pages[i].style.display = "none";
          document.getElementById(pageToDisplay.toLowerCase() + "-page").style.display = "flex";
          }, 500);
        break;
      }
    }
    setTimeout(() => {
      document.getElementById(pageToDisplay.toLowerCase() + "-page").className="page active";
      document.getElementById("contact-section").style.opacity = "1";
      }, 600);
  }
}

//Click event handler for the .screenshotLink elements
function screenshotLinksClickEventHandler(e) {
  //Retrieve the project name
  projectName = e.target.classList[1];
  
  //Display the Screenshots Overlay
  document.getElementById("screenshots-overlay").style.display = "block";
  setTimeout(() => {
    document.getElementById("screenshots-overlay").className = "active";  
    }, 100);

  //Display the project's screenshots
  document.getElementById(projectName + "-screenshots").style.display = "block";
  
  //Retrieve the screenshot screens
  screenshotScreens = document.getElementById(projectName + "-screenshots").children;
  //Set the first screenshot screen active
  screenshotScreens[0].className = "screenshot active";
  currentScreenshot = 0;
  //Move the other screenshot screens to the right
  for (let i=1; i < screenshotScreens.length;i++) {
    screenshotScreens[i].className = "screenshot right";
  }
  //Display the Skip Right button
  if (screenshotScreens.length > 1) {
    document.getElementById("screenshots-skip-right").style.display = "flex";
  }
  setTimeout(() => {
    //Reveal the screenshots container
    document.getElementById(projectName + "-screenshots").style.opacity = "1";
    }, 500);
}

//Click event handler for the Close Screenshot Overlay button
function screenshotCloseClickEventHandler() {
  //Hide the screenshots container
  document.getElementById(projectName + "-screenshots").style.opacity = "0";
  setTimeout(() => {
    document.getElementById(projectName + "-screenshots").style.display = "none";
    }, 1000);
  
  //Hide the screenshots overlay element
  setTimeout(() => {
    document.getElementById("screenshots-overlay").className = "";
    //Remove skip and close buttons
    setTimeout(() => {
      document.getElementById("screenshots-skip-right").style.display = "none";
      document.getElementById("screenshots-skip-left").style.display = "none";
      document.getElementById("screenshots-overlay").style.display = "none";
      }, 1000);
    }, 300);
}

//Click event handler for Skip Left button
function screenshotsSkipLeftClickEventHandler() {
  //Move current screenshot to the right
  screenshotScreens[currentScreenshot].className = "screenshot right";
  //Change to previous screenshot and make active
  currentScreenshot--;
  screenshotScreens[currentScreenshot].className = "screenshot active";
  //Remove Skip Left button if current screenshot is the first
  if (currentScreenshot === 0) {
    document.getElementById("screenshots-skip-left").style.display = "none";
  }
  //Show Skip Right botton if previous screenshot was the last
  if (currentScreenshot === screenshotScreens.length - 2) {
    document.getElementById("screenshots-skip-right").style.display = "flex";
  }
}

function screenshotsSkipRightClickEventHandler() {
  //Move current screenshot to the left
  screenshotScreens[currentScreenshot].className = "screenshot left";
  //Change to next screenshot and make active
  currentScreenshot++;
  screenshotScreens[currentScreenshot].className = "screenshot active";
  //Display Skip Left button if previous screenshot was the first
  if (currentScreenshot === 1) {
    document.getElementById("screenshots-skip-left").style.display = "flex";
  }
  //Remove Skip Right button if current screenshot is the last
  if (currentScreenshot === screenshotScreens.length - 1) {
    document.getElementById("screenshots-skip-right").style.display = "none";
  }
}