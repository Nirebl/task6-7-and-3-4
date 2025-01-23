function fadeIn(element, duration = 500, callback) {
    element.style.display = 'block';
    element.style.pointerEvents = 'auto';
    element.style.opacity = "0";
    let startTime = null;
    function animateFade(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let fraction = Math.min(progress / duration, 1);
        element.style.opacity = fraction.toString();
        if (fraction < 1) {
            requestAnimationFrame(animateFade);
        } else {
            if (callback) callback();
        }
    }
    requestAnimationFrame(animateFade);
}

function fadeOut(element, duration = 500, callback) {
    let startTime = null;
    let initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
    function animateFade(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let fraction = Math.min(progress / duration, 1);
        element.style.opacity = (initialOpacity * (1 - fraction)).toString();
        if (fraction < 1) {
            requestAnimationFrame(animateFade);
        } else {
            element.style.display = 'none';
            element.style.pointerEvents = 'none';
            if (callback) callback();
        }
    }
    requestAnimationFrame(animateFade);
}

function expandElement(element, duration = 300, callback) {
    element.style.overflow = 'hidden';
    element.style.display = 'flex';
    let startHeight = 0;
    let endHeight = element.scrollHeight;
    element.style.height = startHeight + 'px';
    let startTime = null;
    function animateHeight(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let fraction = Math.min(progress / duration, 1);
        let currentHeight = startHeight + fraction * (endHeight - startHeight);
        element.style.height = currentHeight + 'px';
        if (fraction < 1) {
            requestAnimationFrame(animateHeight);
        } else {
            element.style.height = 'auto';
            element.style.overflow = 'visible';
            if (callback) callback();
        }
    }
    requestAnimationFrame(animateHeight);
}

function collapseElement(element, duration = 300, callback) {
    let startHeight = element.scrollHeight;
    element.style.overflow = 'hidden';
    let startTime = null;
    function animateHeight(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let fraction = Math.min(progress / duration, 1);
        let currentHeight = startHeight - fraction * startHeight;
        element.style.height = currentHeight + 'px';
        if (fraction < 1) {
            requestAnimationFrame(animateHeight);
        } else {
            element.style.height = '0';
            if (callback) callback();
        }
    }
    requestAnimationFrame(animateHeight);
}

const menuData = [
    {
        name: 'News',
        subItems: ['Sub Item 1', 'Sub Item 2', 'Sub Item 3']
    },
    {
        name: 'Music',
        subItems: ['Sub Item A', 'Sub Item B']
    },
    {
        name: 'Links',
        subItems: ['Sub Item 1', 'Sub Item 2', 'Sub Item 3']
    }
];

const menuToggleBtn = document.getElementById('menuToggleBtn');
const menuOverlay = document.getElementById('menuOverlay');
const menuContainer = document.getElementById('menuContainer');

let overlayOpen = false;
let currentlyOpenSubMenu = null;

function createMenu() {
    menuData.forEach(menuItem => {
        const menuDiv = document.createElement('div');
        menuDiv.classList.add('menu-item');

        const menuLabel = document.createElement('div');
        menuLabel.classList.add('menu-label');
        menuLabel.setAttribute('data-menu', menuItem.name);

        const logoImg = document.createElement('img');
        logoImg.src = 'images/logo.svg';
        logoImg.classList.add('logo');
        logoImg.alt = 'Nirebl demo Logo';
        logoImg.width = 120;

        const menuText = document.createElement('div');
        menuText.classList.add('menu-text');
        menuText.textContent = menuItem.name;

        const subMenu = document.createElement('div');
        subMenu.classList.add('dynamicSubMenu');

        menuLabel.appendChild(logoImg);
        menuLabel.appendChild(menuText);
        menuLabel.appendChild(subMenu);
        menuDiv.appendChild(menuLabel);
        menuContainer.appendChild(menuDiv);
    });
}

createMenu();

function populateSubMenu(subMenuElement, items) {
    subMenuElement.innerHTML = '';
    items.forEach(item => {
        const subItemDiv = document.createElement('div');
        subItemDiv.classList.add('sub-menu-item');
        subItemDiv.textContent = item;
        subMenuElement.appendChild(subItemDiv);
    });
}

menuToggleBtn.addEventListener('click', () => {
    if (!overlayOpen) {
        fadeIn(menuOverlay, 300);
        overlayOpen = true;
    } else {
        fadeOut(menuOverlay, 300, () => {
            collapseSubMenu();
        });
        overlayOpen = false;
    }
});

const menuLabels = document.querySelectorAll('.menu-label');

menuLabels.forEach(label => {
    label.addEventListener('click', (event) => {
        event.stopPropagation();
        const menuName = label.getAttribute('data-menu');
        const menuItemData = menuData.find(item => item.name === menuName);
        const subMenu = label.querySelector('.dynamicSubMenu');

        if (!menuItemData) return;

        if (currentlyOpenSubMenu && currentlyOpenSubMenu !== subMenu) {
            collapseElement(currentlyOpenSubMenu, 300, () => {
                currentlyOpenSubMenu.classList.remove('active');
                populateSubMenu(subMenu, menuItemData.subItems);
                expandElement(subMenu, 300);
                subMenu.classList.add('active');
                currentlyOpenSubMenu = subMenu;
            });
        } else if (currentlyOpenSubMenu === subMenu) {
            collapseElement(subMenu, 300, () => {
                subMenu.classList.remove('active');
                currentlyOpenSubMenu = null;
            });
        } else {
            populateSubMenu(subMenu, menuItemData.subItems);
            expandElement(subMenu, 300);
            subMenu.classList.add('active');
            currentlyOpenSubMenu = subMenu;
        }
    });
});

function collapseSubMenu() {
    if (currentlyOpenSubMenu) {
        collapseElement(currentlyOpenSubMenu, 300, () => {
            currentlyOpenSubMenu.classList.remove('active');
            currentlyOpenSubMenu = null;
        });
    }
}

document.addEventListener('click', (event) => {
    if (!menuOverlay.contains(event.target) && !menuToggleBtn.contains(event.target)) {
        if (overlayOpen) {
            fadeOut(menuOverlay, 300, () => {
                collapseSubMenu();
            });
            overlayOpen = false;
        }
    }
});
