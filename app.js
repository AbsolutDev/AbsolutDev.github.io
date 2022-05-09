//Retrieves all elements linked to content (class of nav-link)
const pageNavLinks = document.querySelector("header").getElementsByClassName("nav-link");

//Retrieves all content pages
const pageTabs = document.querySelector("main").getElementsByClassName("content");
let currentTab=-1;

//Creates event listeners for nav-links: click, mouseover and mouseout
for (let i=0; i<pageNavLinks.length;i++) {
  pageNavLinks[i].onclick = navClick;
  if (i>0) {
    pageNavLinks[i].onmouseover = mouseOverNav;
    pageNavLinks[i].onmouseout = mouseOverNav;
  }
}

//Function that switches content by changing opacity and z-index
function switchContent (tabNumber) {
  for (let i=0;i<pageTabs.length;i++) {
    if (i === tabNumber) {
      pageTabs[i].style.opacity="1";
      pageTabs[i].style.zIndex="5";
      
      if (i!==0) {
        pageNavLinks[i].style.color="hsl(60, 6%, 40%)";
      }
    } else {
      pageTabs[i].style.opacity="0";
      pageTabs[i].style.zIndex="0";
      if (i!==0) {
        pageNavLinks[i].style.color="hsl(60, 6%, 68%)";
      }
    }
  }
}

function mouseOverNav (event) {
  if (currentTab < 0 || event.target.innerHTML !== pageNavLinks[currentTab].innerHTML) {
    if (event.type==="mouseover") {
      event.target.style.color="hsl(60, 6%, 40%)";
    } else {
      event.target.style.color="hsl(60, 6%, 68%)";
    }
  }
}


function navClick (event) {
  for (let i=0; i<pageNavLinks.length;i++) {
    if (event.target.innerHTML === pageNavLinks[i].innerHTML) {
      currentTab=i;
      switchContent(currentTab);
      break;
    }
  }
}


