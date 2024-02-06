const skillsList = ['HTML', 'CSS', 'JAVASCRIPT', 'REACT', 'REDUX', 'VUE.JS', 'TYPESCRIPT', 'JQUERY', 'SASS', 'TAILWIND CSS', 'REACT NATIVE', 'NODE.JS', 'POSTGRESQL', 'EXPRESS.JS', 'C#'];
const skillsSideElement = document.getElementById('skills-side');
const enterButton = document.getElementById('enter-button-container');
const skipIntro = true;

const navItems = document.getElementsByClassName('nav-item-container');
const screens = document.getElementsByClassName('page');
for (let screen of screens) {
  screen.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'opacity' && event.target.style.opacity === '0') {
      event.target.style.display = 'none';
    }
  })
}
let displayedPage;

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

function fadeOutElement(element, delay = 0) {
  setTimeout(() => {
    element.style.opacity = '0';
  }, delay)
}

function exitLeft(element, delay = 0) {
  element.style.left = '0px';
  setTimeout(() => {
    element.style.left = -(element.offsetLeft + element.offsetWidth) + 'px';
    element.style.opacity = '0';
  }, delay)
}

function slideIn(element, side, delay = 0) {
  switch (side) {
    case 'top':
      setTimeout(() => {
        element.style.top = '0px';
      }, delay);
      break;
    case 'left':
      setTimeout(() => {
        element.style.left = '0px';
      }, delay);
      break;
    case 'right':
      setTimeout(() => {
        element.style.right = '0px';
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

  enterButton.onclick = (() => {
    let delay = 300;
    document.body.style.overflow = 'hidden';
    exitLeft(document.getElementById('anim-name'), 100);
    exitLeft(document.getElementById('anim-title'), 300);
    exitLeft(document.getElementById('bottom-side'), 600);
    exitLeft(document.getElementById('skills-side'), 600);
    removeElement(document.getElementById('intro-screen'), 1200);
    displayElement(document.getElementById('main-screen'), 'block', 800);
    setTimeout(() => {
      slideIn(document.getElementById('main-header'), 'top', 400);
      document.getElementById('nav-menu-container').childNodes.forEach((element) => {
        if (element.nodeType === 1) {
          slideIn(element, 'left', delay);
          delay += 100;
        }
      });
      delay = 400;
      document.getElementById('nav-icons-container').childNodes.forEach((element) => {
        if (element.nodeType === 1) {
          slideIn(element, 'left', delay);
          delay += 250;
        }
      });
      transitionToPage(0, 300);
    }, 800);
  });
} else {
  removeElement(document.getElementById('intro-screen'));
  displayElement(document.getElementById('main-screen'), 'block', 50);
  document.getElementById('main-header').style.top = 0;
  document.getElementById('nav-menu-container').childNodes.forEach((element) => {
    if (element.nodeType === 1) {
      element.style.left = 0;
    }
  });
  document.getElementById('nav-icons-container').childNodes.forEach((element) => {
    if (element.nodeType === 1) {
      element.style.left = 0;
    }
  });
  displayElement(document.getElementById('page-home'), 'flex');
  document.getElementById('page-home-title').style.right = 0;
  document.getElementById('page-home-message').style.right = 0;
  transitionToPage(0, 300);
}

//Page transitions
function transitionToPage(pageIndex, delay = 0) {
  delay+=400;
  if (displayedPage !== undefined) {
    fadeOutElement(screens[displayedPage]);
  }
  switch (pageIndex) {
    case 0:
      displayElement(document.getElementById('page-home'), 'flex', delay);
      slideIn(document.getElementById('page-home-title'), 'right', delay + 200);
      slideIn(document.getElementById('page-home-message'), 'right', delay + 400);
      //document.body.style.overflow = 'auto';
      break;
    case 1:
      displayElement(document.getElementById('page-about'), 'block', delay);
      document.getElementById('page-about').children[0].style.opacity = '1';
      break;
    case 2:
      displayElement(document.getElementById('page-skills'), 'flex', delay);
      break;
    case 3:
      displayElement(document.getElementById('page-portfolio'), 'flex', delay);
      break;
    case 4:
      displayElement(document.getElementById('page-contact'), 'flex', delay);
      break;
  }
  displayedPage = pageIndex;
}

//Navigation menu
for (let navItem of navItems) {
  navItem.addEventListener('click', navItemClickEventHandler);
}

function navItemClickEventHandler(event) {
  const element = event.target.classList[0] === 'nav-item-container' ? event.target : event.target.parentNode;
  const elementIndex = (Array.prototype.indexOf.call(element.parentNode.childNodes, element) - 1) / 2;
  if (elementIndex !== displayedPage) {
    navItems[displayedPage].classList.remove('selected');
    navItems[elementIndex].classList.add('selected');
    transitionToPage(elementIndex, 100);
  }
}

//About me page

