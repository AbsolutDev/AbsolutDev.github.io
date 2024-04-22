const skillsList = ['HTML', 'CSS', 'JAVASCRIPT', 'REACT', 'REDUX', 'VUE.JS', 'TYPESCRIPT', 'JQUERY', 'SASS', 'TAILWIND CSS', 'REACT NATIVE', 'NODE.JS', 'POSTGRESQL', 'EXPRESS.JS', 'C#'];
const skillsSideElement = document.getElementById('skills-side');
const enterButton = document.getElementById('enter-button-container');
const modeButton = document.getElementById('mode-button-container');
const skipIntro = false;

const themeNames = ['theme-plain', 'theme-about', 'theme-skills', 'theme-projects', 'theme-contact'];
const sectionTitles = ['Welcome', 'About', 'Skills', 'Portfolio', 'Contact'];
const titleElements = document.getElementsByClassName('section-title-side');

let swipeStartX, swipeStartY, swipeStartTime;
let scrollY = 0;
let scrollOnHold = false;

let darkTheme = false;
document.body.classList.add('ddark');

const screenIsLandscape = window.innerWidth / innerHeight >= 1.25 ? true : false;

//Set the theme to dark/light based on prefered colour scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkTheme = true;
  document.body.classList.add('dark');
}

//Assign window event listeners
window.addEventListener('scrollend', onScrollEndEventHandler);
window.addEventListener('wheel', onWheelEventHandler);
window.addEventListener('keyup', onKeyUpEventHandler);
window.addEventListener('touchstart', touchStartEventListener);
window.addEventListener('touchend', touchEndEventListener);

//Nav Menu Related
let navMenuDisplay = false;
let mouseOverNavMenu = false;
let navItemClick = false;
document.getElementById('nav-button').addEventListener('click', navButtonClickEventHandler);
document.getElementById('nav-menu').addEventListener('mouseenter', () => { mouseOverNavMenu = true });
document.getElementById('nav-menu').addEventListener('mouseleave', () => {
  mouseOverNavMenu = false;
  if (navItemClick)
    setTimeout(closeNavMenu, 1000);
});
const navItems = document.getElementsByClassName('nav-item');
for (let navItem of navItems) {
  navItem.addEventListener('click', navItemClickEventListener);
}
navItems[0].parentNode.classList.add('selected');

document.body.addEventListener('click', () => {
  if (!mouseOverNavMenu && navMenuDisplay) {
    closeNavMenu();
  }
});

//Store all content sections
const contentSections = document.getElementsByClassName('section-content');
const contentContainers = document.getElementsByClassName('section-container');
let displayedPage = 0;

//About Section
const aboutPages = document.getElementsByClassName('about-page');
aboutPages[0].style.opacity = '1';
let displayedAboutPage = 0;
document.getElementById('about-button-prev').classList.add('inactive');
document.getElementById('about-button-prev').addEventListener('click', aboutButtonsOnClickEventListener);
document.getElementById('about-button-next').addEventListener('click', aboutButtonsOnClickEventListener);

//Projects Section
let projectInfoOpen = null;
let projectScreenshotInView = 0;
let projectThumbSelected = null;
const projectThumbs = document.getElementsByClassName('project-thumb-caption');
const projectsInfo = document.getElementsByClassName('project-info-overlay');

for (let projectThumb of projectThumbs) {
  projectThumb.addEventListener('click', projectThumbOnClickEventListener);
  projectThumb.addEventListener('mouseover', projectThumbOnMouseOverEventListener);
  projectThumb.addEventListener('mouseout', projectThumbOnMouseOutEventListener);
}
const projectInfoCloseButtons = document.getElementsByClassName('project-info-close-button');
for (let projectCloseButton of projectInfoCloseButtons) {
  projectCloseButton.addEventListener('click', projectInfoCloseButtonOnClickEventHandler);
}
const projectScreenshotVisors = [];
const projectProgressContainers = [];
const projectNavContainers = [];

//Contact Section
document.getElementById('form-submit-visor').addEventListener('mouseover', slideBgUnderButton);
document.getElementById('form-submit-visor').addEventListener('mouseout', slideBgUnderButton);
document.getElementById('form-submit-visor').addEventListener('click', submitButtonOnClickEventHandler);

//Intro animations
function animateChars(text, parentId, childClass, allCaps, start, delay) {
  const parentElement = document.getElementById(parentId);
  let timer = start;
  if (allCaps) text = text.toUpperCase();
  const textChars = text.split('');
  textChars.forEach((char) => {
    const charElement = document.createElement('div');
    charElement.className = childClass;
    if (char === ' ') {
      charElement.innerText = String.fromCharCode(160);
    } else {
      charElement.innerText = char;
    }
    parentElement.append(charElement);
    setTimeout(() => {
      charElement.style.marginTop = '0';
    }, timer += delay);
  })
}

function addSkills() {
  let timer = 100;
  skillsList.forEach((skill, index) => {
    const skillElement = document.createElement('div');
    skillElement.innerText = skill;
    skillElement.className = 'skill';
    skillElement.style.opacity = '0';
    skillsSideElement.append(skillElement);
    if (index === 0) {
      //Prepend a blank element with same height as 1st skill element
      const blankElement = document.createElement('div');
      const firstElementHeight = skillElement.offsetHeight;
      blankElement.className = 'skill';
      blankElement.style.height = firstElementHeight + 'px';
      skillsSideElement.style.top = '-' + firstElementHeight - 1 + 'px';
      skillsSideElement.style.height = skillsSideElement.offsetHeight + firstElementHeight + 'px';
      skillsSideElement.prepend(blankElement);
    }
    skillElement.style.height = skillElement.offsetHeight + 'px';
    setTimeout(() => {
      skillElement.style.opacity = '1';
    }, timer += 100);
  })
  const lastElement = skillsSideElement.childNodes[skillsSideElement.childNodes.length - 1];
  if (lastElement.offsetTop + lastElement.offsetHeight > skillsSideElement.offsetTop + skillsSideElement.offsetHeight) {
    //Last element overflows its container
    skillsSideElement.childNodes[0].addEventListener('transitionend', slideSkillsUpHandler)
    setTimeout(() => {
      skillsSideElement.childNodes[0].style.height = '0px';
    }, 1000);
  }
}

function slideSkillsUpHandler() {
  skillsSideElement.childNodes[0].removeEventListener('transitionend', slideSkillsUpHandler);
  skillsSideElement.removeChild(skillsSideElement.childNodes[0]);
  const newElement = document.createElement('div');
  newElement.className = 'skill';
  newElement.innerText = skillsSideElement.childNodes[0].innerText;
  newElement.style.height = skillsSideElement.childNodes[0].offsetHeight + 'px';
  skillsSideElement.append(newElement);
  skillsSideElement.childNodes[0].innerText = '';
  skillsSideElement.childNodes[0].addEventListener('transitionend', slideSkillsUpHandler)
  skillsSideElement.childNodes[0].style.height = '0px';
}

function displayElement(element, displaySetting, delay = 0) {
  setTimeout(() => {
    element.style.display = displaySetting;
    setTimeout(() => {
      element.style.opacity = '1';
    }, 50);
  }, delay)
}

function unDisplayElement(element, transitionTimer = 0, delay = 0) {
  setTimeout(() => {
    element.style.opacity = '0';
    setTimeout(() => {
      element.style.display = 'none';
    }, transitionTimer);
  }, delay)
}

function delayedFadeElement(element, opacity, delay = 0) {
  setTimeout(() => {
    element.style.opacity = opacity;
  }, delay)
}

function exitLeft(element, delay = 0) {
  element.style.left = '0px';
  setTimeout(() => {
    element.style.left = -(element.offsetLeft + element.offsetWidth) + 'px';
    element.style.opacity = '0';
  }, delay)
}

function slideIn(element, side, delay = 0, position = '0px') {
  switch (side) {
    case 'top':
      setTimeout(() => {
        element.style.top = position;
      }, delay);
      break;
    case 'left':
      setTimeout(() => {
        element.style.left = position;
      }, delay);
      break;
    case 'right':
      setTimeout(() => {
        element.style.right = position;
      }, delay);
      break;
    default:
      break;
  }
}

function removeElement(element, delay = 0) {
  setTimeout(() => {
    element.parentElement.removeChild(element);
  }, delay)
}

if (!skipIntro) {
  addSkills();
  animateChars('Web Developer', 'anim-title', 'anim-title-char', true, 500, 100);
  animateChars('Gabriel Iliescu', 'anim-name', 'anim-name-char', false, 700, 100);
  displayElement(enterButton, 'inline-block', 2000);
  displayElement(modeButton, 'inline-flex', 2300);
  modeButton.onclick = (() => {
    if (darkTheme) {
      document.body.classList.remove('dark');
      darkTheme = false;
    } else {
      document.body.classList.add('dark');
      darkTheme = true;
    }
  })
  enterButton.onclick = (() => {
    //Remove intro elements
    document.body.style.overflow = 'hidden';
    exitLeft(document.getElementById('anim-name'), 100);
    exitLeft(document.getElementById('anim-title'), 300);
    exitLeft(document.getElementById('bottom-side'), 600);
    exitLeft(document.getElementById('skills-side'), 600);
    removeElement(document.getElementById('intro-screen'), 1000);
    //Bring in main site elements
    displayElement(document.getElementById('main-screen'), 'block', 1050);
    setTimeout(() => {
      initMainScreen();
    }, 1100);
  });
} else {
  removeElement(document.getElementById('intro-screen'));
  displayElement(document.getElementById('main-screen'), 'block', 50);
  setTimeout(() => {
    initMainScreen();
  }, 200);
}

function initMainScreen() {
  let delay = 0;
  const firstTitle = document.getElementsByClassName('section-title-side')[0];
  document.getElementById('main-screen').className = themeNames[0];
  slideIn(firstTitle, 'left');
  delayedFadeElement(firstTitle, 1, 100);
  slideIn(document.getElementById('home-section-content'), 'right', 200);
  slideIn(document.getElementById('scroll-down-anim-container'), 'right', 300);
  for (let contactIconContainer of document.getElementById('contact-icons-container').children) {
    slideIn(contactIconContainer, 'left', 500);
    delay += 200;
  }

  const contactIconCaptions = document.getElementsByClassName('contact-icon-caption');
  for (let contactIconCaptionIndex = 0; contactIconCaptionIndex < contactIconCaptions.length; contactIconCaptionIndex++) {
    contactIconCaptions[contactIconCaptionIndex].style.left = -(contactIconCaptions[contactIconCaptionIndex].offsetLeft + contactIconCaptions[contactIconCaptionIndex].offsetWidth) + 'px';
  }

  scrollY = window.scrollY;
  setTimeout(() => {
    firstTitle.style.position = 'sticky';
  }, delay + 1200);

  //Project Screenshots Carousel Init
  for (let projectIndex = 0; projectIndex < projectThumbs.length; projectIndex++) {
    if (!projectThumbs[projectIndex].parentNode.classList.contains('dummy') && projectsInfo[projectIndex].getElementsByClassName('screenshots-visor')[0].children.length > 1) {
      if (projectsInfo[projectIndex].getElementsByClassName('project-screenshots').length) {
        projectScreenshotVisors.push([...projectsInfo[projectIndex].getElementsByClassName('project-screenshots')]);
        projectProgressContainers.push([...projectsInfo[projectIndex].getElementsByClassName('project-screenshots-progress')]);
        projectNavContainers.push([...projectsInfo[projectIndex].getElementsByClassName('screenshots-nav')]);
        for (let screenshotVisorIndex = 0; screenshotVisorIndex < projectScreenshotVisors[projectIndex].length; screenshotVisorIndex++) {
          const visorElement = projectScreenshotVisors[projectIndex][screenshotVisorIndex].getElementsByClassName('screenshots-visor')[0];
          for (let projectScreenshotIndex = 0; projectScreenshotIndex < visorElement.children.length; projectScreenshotIndex++) {
            const newBullet = document.createElement('span');
            newBullet.className = 'progress-bullet';
            if (projectScreenshotIndex === 0) {
              newBullet.classList.add('current');
              visorElement.children[projectScreenshotIndex].style.right = '0px';
              //visorElement.children[projectScreenshotIndex].style.opacity = '1';
            } else {
              visorElement.children[projectScreenshotIndex].style.right = '-100%';
              //visorElement.children[projectScreenshotIndex].style.opacity = '0';
            }
            projectProgressContainers[projectIndex][screenshotVisorIndex].append(newBullet);
          }
        }
      } else {
        projectScreenshotVisors.push(null);
        projectProgressContainers.push(null);
        projectNavContainers.push(null);
      }
    } else {
      projectScreenshotVisors.push(null);
      projectProgressContainers.push(null);
      projectNavContainers.push(null);
    }
  }
  transitionPageIn(0);
}

//Page transitions IN
function transitionPageIn(pageIndex) {
  if (pageIndex > 0) {
    contentContainers[pageIndex].style.opacity = '1';
    if (pageIndex === 4) {
      const contactIconCaptions = document.getElementsByClassName('contact-icon-caption');
      for (let contactIconCaptionIndex = 0; contactIconCaptionIndex < contactIconCaptions.length; contactIconCaptionIndex++) {
        contactIconCaptions[contactIconCaptionIndex].style.opacity = '1';
        contactIconCaptions[contactIconCaptionIndex].style.left = '0px';
      }
    }
  }
  displayedPage = pageIndex;
}

//Page transitions OUT
function transitionPageOut(pageIndex) {
  if (pageIndex > 0) {
    contentContainers[pageIndex].style.opacity = '0';
    if (pageIndex = 4) {
      const contactIconCaptions = document.getElementsByClassName('contact-icon-caption');
      for (let contactIconCaptionIndex = 0; contactIconCaptionIndex < contactIconCaptions.length; contactIconCaptionIndex++) {
        contactIconCaptions[contactIconCaptionIndex].style.opacity = '0';
        contactIconCaptions[contactIconCaptionIndex].style.left = -(contactIconCaptions[contactIconCaptionIndex].offsetLeft + contactIconCaptions[contactIconCaptionIndex].offsetWidth) + 'px';
      }
    }
  }
}

function changeDisplayPage(nextPage) {
  navItems[displayedPage].parentNode.classList.remove('selected');
  if (nextPage < displayedPage) {
    //Move up; transition out sections underneath
    for (let page = nextPage + 1; page <= displayedPage; page++) {
      transitionPageOut(page);
    }
  } else {
    //Move down; transition in current and previous sections
    for (let page = displayedPage + 1; page <= nextPage; page++) {
      transitionPageIn(page);
    }
  }
  contentContainers[nextPage].scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('main-screen').className = themeNames[nextPage];
  navItems[nextPage].parentNode.classList.add('selected');
  displayedPage = nextPage;
}

function scrollDown() {
  if (contentContainers[displayedPage].getBoundingClientRect().bottom > window.innerHeight * 1.1) {
    if ((contentContainers[displayedPage].getBoundingClientRect().bottom - window.innerHeight) < window.innerHeight) {
      //Scroll to end of current section
      contentContainers[displayedPage].scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      //Scroll up by a screen height
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    }
  } else if (displayedPage < contentContainers.length - 1) {
    //Move to next section
    changeDisplayPage(displayedPage + 1)
  }
}

function scrollUp() {
  if (contentContainers[displayedPage].getBoundingClientRect().top < (-window.innerHeight * 0.1)) {
    if (contentContainers[displayedPage].getBoundingClientRect().top > (-window.innerHeight)) {
      //Scroll to start of current section
      contentContainers[displayedPage].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      //Scroll up by a screen height
      window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })
    }
  } else if (displayedPage > 0) {
    //Move to prev section
    changeDisplayPage(displayedPage - 1)
  }
}

function navigateAboutPage(dest) {
  if (displayedAboutPage === 0) {
    document.getElementById('about-button-prev').classList.remove('inactive');
  } else if (displayedAboutPage === aboutPages.length - 1) {
    document.getElementById('about-button-next').classList.remove('inactive');
  }
  if (dest === 0) {
    document.getElementById('about-button-prev').classList.add('inactive');
  } else if (dest === aboutPages.length - 1) {
    document.getElementById('about-button-next').classList.add('inactive');
  }
  aboutPages[displayedAboutPage].style.opacity = '0';
  setTimeout(() => {
    aboutPages[dest].style.opacity = '1';
  }, 300);
  displayedAboutPage = dest;
}

function onKeyUpEventHandler(e) {
  switch (e.key) {
    case 'ArrowDown':
    case ' ':
      scrollDown();
      break;
    case 'ArrowUp':
      scrollUp();
      break;
    case 'ArrowLeft':
      if (displayedPage === 1 && displayedAboutPage > 0) {
        navigateAboutPage(displayedAboutPage - 1);
      }
      break;
    case 'ArrowRight':
      if (displayedPage === 1 && displayedAboutPage < aboutPages.length - 1) {
        navigateAboutPage(displayedAboutPage + 1);
      }
      break;
  }
}

function onWheelEventHandler(e) {
  if (!scrollOnHold) {
    if (projectInfoOpen === null) {
      if (navMenuDisplay)
        closeNavMenu();
      if (e.deltaY > 0) {
        //Scroll down
        scrollDown();
        scrollOnHold = true;
      } else {
        //Scroll up
        scrollUp();
        scrollOnHold = true;
      }
    }
    setTimeout(() => { scrollOnHold = false; }, 100);
  }
  scrollY = window.scrollY;
}

function onScrollEndEventHandler(e) {
  /*
  if (scrollOnHold) {
    setTimeout(() => { scrollOnHold = false; }, 100);
  }
  */
}

function slideBgUnderButton(e) {
  e.target.parentNode.children[0].style.left = e.type === 'mouseover' ? '0' : '-100%';
}

//Nav Menu Functions
function closeNavMenu() {
  document.getElementById('nav-items-container').classList.remove('active');
  navMenuDisplay = 0;
  navItemClick = false;
}

function navButtonClickEventHandler() {
  if (!navMenuDisplay) {
    document.getElementById('nav-items-container').classList.add('active');
    navMenuDisplay = 1;
  } else {
    closeNavMenu();
  }
}

function navItemClickEventListener(e) {
  const elementIndex = Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode);
  if (elementIndex !== displayedPage) {
    changeDisplayPage(elementIndex);
    navItemClick = true;
  }
}

//About Section Functions
function aboutButtonsOnClickEventListener(e) {
  if (e.target.id === 'about-button-prev' && displayedAboutPage > 0) {
    navigateAboutPage(displayedAboutPage - 1);
  } else if (e.target.id === 'about-button-next' && displayedAboutPage < aboutPages.length - 1) {
    navigateAboutPage(displayedAboutPage + 1);
  }
}

//Project Section Functions
function projectThumbOnClickEventListener(e) {
  if (projectInfoOpen === null && !e.target.parentNode.classList.contains('dummy')) {
    const elementIndex = Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode);
    if (e.pointerType === 'touch' && (projectThumbSelected === null || projectThumbSelected !== elementIndex)) {
      if (projectThumbSelected !== null) {
        projectThumbs[projectThumbSelected].parentNode.classList.remove('selected');
      }
      projectThumbSelected = elementIndex;
      projectThumbs[projectThumbSelected].parentNode.classList.add('selected');
    } else {
      displayElement(projectsInfo[elementIndex], 'flex');
      projectInfoOpen = elementIndex;
      if (projectScreenshotVisors[projectInfoOpen]) {
        for (let navContainerIndex = 0; navContainerIndex < projectNavContainers[projectInfoOpen].length; navContainerIndex++) {
          projectNavContainers[projectInfoOpen][navContainerIndex].addEventListener('click', projectNavContainerOnClickEventListener);
        }
      }
    }
  }
}

function projectThumbOnMouseOverEventListener(e) {
  if (projectInfoOpen === null && !e.sourceCapabilities.firesTouchEvents) {
    //Prevent action if triggered by touch event
    const elementIndex = Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode);
    if (elementIndex !== projectThumbSelected) {
      if (projectThumbSelected !== null) {
        projectThumbs[projectThumbSelected].parentNode.classList.remove('selected');
      }
      projectThumbSelected = elementIndex;
      projectThumbs[projectThumbSelected].parentNode.classList.add('selected');
    }
  }
}

function projectThumbOnMouseOutEventListener(e) {
  if (projectInfoOpen === null && !e.sourceCapabilities.firesTouchEvents) {
    const elementIndex = Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode);
    if (elementIndex === projectThumbSelected) {
      projectThumbs[projectThumbSelected].parentNode.classList.remove('selected');
      projectThumbSelected = null;
    }
  }
}

function projectInfoCloseButtonOnClickEventHandler(e) {
  unDisplayElement(projectsInfo[projectInfoOpen], 500);
  if (projectScreenshotVisors[projectInfoOpen]) {
    if (projectScreenshotInView > 0) {
      for (let screenshotVisorIndex = 0; screenshotVisorIndex < projectScreenshotVisors[projectInfoOpen].length; screenshotVisorIndex++) {
        const visorElement = projectScreenshotVisors[projectInfoOpen][screenshotVisorIndex].getElementsByClassName('screenshots-visor')[0];
        for (let screenshotIndex = 0; screenshotIndex < visorElement.children.length; screenshotIndex++) {
          if (screenshotIndex === 0) {
            visorElement.children[screenshotIndex].style.right = '0px';
            //setTimeout(() => {visorElement.children[screenshotIndex].style.opacity = '1';}, 500);
          } else {
            //visorElement.children[screenshotIndex].style.opacity = '0';
            setTimeout(() => { visorElement.children[screenshotIndex].style.right = '-100%'; }, 500);

          }
        }
        projectProgressContainers[projectInfoOpen][screenshotVisorIndex].children[projectScreenshotInView].classList.remove('current');
        projectProgressContainers[projectInfoOpen][screenshotVisorIndex].children[0].classList.add('current');
      }
      projectScreenshotInView = 0;
      projectNavContainers[projectInfoOpen][0].classList.add('inactive');
      projectNavContainers[projectInfoOpen][1].classList.remove('inactive');
      projectNavContainers[projectInfoOpen][2].classList.add('inactive');
      projectNavContainers[projectInfoOpen][3].classList.remove('inactive');
      projectNavContainers[projectInfoOpen][0].removeEventListener('click', projectNavContainerOnClickEventListener);
      projectNavContainers[projectInfoOpen][1].removeEventListener('click', projectNavContainerOnClickEventListener);
      projectNavContainers[projectInfoOpen][2].removeEventListener('click', projectNavContainerOnClickEventListener);
      projectNavContainers[projectInfoOpen][3].removeEventListener('click', projectNavContainerOnClickEventListener);
    }
  }
  projectThumbs[projectThumbSelected].parentNode.classList.remove('selected');
  projectThumbSelected = null;
  projectInfoOpen = null;
}

function projectNavContainerOnClickEventListener(e) {
  if ((e.target === projectNavContainers[projectInfoOpen][1] || e.target === projectNavContainers[projectInfoOpen][3]) && projectScreenshotInView < projectScreenshotVisors[projectInfoOpen][0].getElementsByClassName('screenshots-visor')[0].childElementCount - 1) {
    for (let screenshotVisorIndex = 0; screenshotVisorIndex < projectScreenshotVisors[projectInfoOpen].length; screenshotVisorIndex++) {
      const visorElement = projectScreenshotVisors[projectInfoOpen][screenshotVisorIndex].getElementsByClassName('screenshots-visor')[0];
      visorElement.children[projectScreenshotInView].style.right = '100%';
      //visorElement.children[projectScreenshotInView].style.opacity = '0';
      projectProgressContainers[projectInfoOpen][screenshotVisorIndex].children[projectScreenshotInView].classList.remove('current');
      visorElement.children[projectScreenshotInView + 1].style.right = '0px';
      //visorElement.children[projectScreenshotInView + 1].style.opacity = '1';
      projectProgressContainers[projectInfoOpen][screenshotVisorIndex].children[projectScreenshotInView + 1].classList.add('current');
    }
    projectScreenshotInView++;
    if (projectScreenshotInView === projectScreenshotVisors[projectInfoOpen][0].getElementsByClassName('screenshots-visor')[0].childElementCount - 1) {
      projectNavContainers[projectInfoOpen][1].classList.add('inactive');
      projectNavContainers[projectInfoOpen][3].classList.add('inactive');
    } else if (projectScreenshotInView === 1) {
      projectNavContainers[projectInfoOpen][0].classList.remove('inactive');
      projectNavContainers[projectInfoOpen][2].classList.remove('inactive');
    }
  } else if ((e.target === projectNavContainers[projectInfoOpen][0] || e.target === projectNavContainers[projectInfoOpen][2]) && projectScreenshotInView > 0) {
    for (let screenshotVisorIndex = 0; screenshotVisorIndex < projectScreenshotVisors[projectInfoOpen].length; screenshotVisorIndex++) {
      const visorElement = projectScreenshotVisors[projectInfoOpen][screenshotVisorIndex].getElementsByClassName('screenshots-visor')[0];
      visorElement.children[projectScreenshotInView].style.right = '-100%';
      //visorElement.children[projectScreenshotInView].style.opacity = '0';
      projectProgressContainers[projectInfoOpen][screenshotVisorIndex].children[projectScreenshotInView].classList.remove('current');
      visorElement.children[projectScreenshotInView - 1].style.right = '0px';
      //visorElement.children[projectScreenshotInView - 1].style.opacity = '1';
      projectProgressContainers[projectInfoOpen][screenshotVisorIndex].children[projectScreenshotInView - 1].classList.add('current');
    }
    projectScreenshotInView--;
    if (projectScreenshotInView === projectScreenshotVisors[projectInfoOpen][0].getElementsByClassName('screenshots-visor')[0].childElementCount - 2) {
      projectNavContainers[projectInfoOpen][1].classList.remove('inactive');
      projectNavContainers[projectInfoOpen][3].classList.remove('inactive');
    } else if (projectScreenshotInView === 0) {
      projectNavContainers[projectInfoOpen][0].classList.add('inactive');
      projectNavContainers[projectInfoOpen][2].classList.add('inactive');
    }
  } else if ((e.target === projectNavContainers[projectInfoOpen][0] || e.target === projectNavContainers[projectInfoOpen][2]) && projectScreenshotInView > 0) {
    console.log('left');
  }
}

//Contact Section Event Handlers
function submitButtonOnClickEventHandler(e) {
  e.preventDefault();
  if (document.getElementById('contact-form').reportValidity() && document.getElementById('form-email').validity.valid && document.getElementById('form-message').validity.valid) {
    const formData = new FormData(document.getElementById("contact-form"));
    fetch("https://usebasin.com/f/f5c6864fc67e", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  })
  .then((response) => {
    if (response.status === 200) {
      document.getElementById("form-submit-fg").innerHTML='Sent';
      document.getElementById("form-name").value="";
      document.getElementById("form-email").value="";
      document.getElementById("form-message").value="";
    } else {
      document.getElementById("form-submit").value="error";
    }
  })
  .catch((error) => console.log(error));
  }
}

//Touch events control
function touchStartEventListener(e) {
  swipeStartX = e.changedTouches[0].pageX;
  swipeStartY = e.changedTouches[0].pageY;
  swipeStartTime = new Date().getTime();
}

function touchEndEventListener(e) {
  const threshold = 80;
  const restraint = 100;
  const allowedTime = 300;
  const distX = e.changedTouches[0].pageX - swipeStartX;
  const distY = e.changedTouches[0].pageY - swipeStartY;
  const elapsedTime = new Date().getTime() - swipeStartTime;
  if (elapsedTime <= allowedTime) {
    if (displayedPage === 1 && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
      if (distX >= 0 && displayedAboutPage > 0) {
        navigateAboutPage(displayedAboutPage - 1);
      } else if (distX < 0 && displayedAboutPage < aboutPages.length - 1) {
        navigateAboutPage(displayedAboutPage + 1);
      }
    } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
      if (distY < 0) {
        scrollDown();
      } else {
        scrollUp();
      }
    }
  }
}

//Screenshots left-right areas highlight when touching