function fadeIn(element, duration = 500, callback) {
    element.style.display = 'block'
    element.style.pointerEvents = 'auto'
    element.style.opacity = "0"
    let startTime = null
    function animateFade(timestamp) {
        if (!startTime) startTime = timestamp
        let progress = timestamp - startTime
        let fraction = Math.min(progress / duration, 1)
        element.style.opacity = fraction.toString()
        if (fraction < 1) {
            requestAnimationFrame(animateFade)
        } else {
            if (callback) callback()
        }
    }
    requestAnimationFrame(animateFade)
}
function fadeOut(element, duration = 500, callback) {
    let startTime = null
    let initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1
    function animateFade(timestamp) {
        if (!startTime) startTime = timestamp
        let progress = timestamp - startTime
        let fraction = Math.min(progress / duration, 1)
        element.style.opacity = (initialOpacity * (1 - fraction)).toString()
        if (fraction < 1) {
            requestAnimationFrame(animateFade)
        } else {
            element.style.display = 'none'
            element.style.pointerEvents = 'none'
            if (callback) callback()
        }
    }
    requestAnimationFrame(animateFade)
}
function expandElement(element, duration = 200, callback) {
    element.style.overflow = 'hidden'
    element.style.display = 'block'
    let startHeight = 0
    let endHeight = element.scrollHeight
    element.style.height = startHeight + 'px'
    let startTime = null
    function animateHeight(timestamp) {
        if (!startTime) startTime = timestamp
        let progress = timestamp - startTime
        let fraction = Math.min(progress / duration, 1)
        let currentHeight = startHeight + fraction * (endHeight - startHeight)
        element.style.height = currentHeight + 'px'
        if (fraction < 1) {
            requestAnimationFrame(animateHeight)
        } else {
            element.style.height = endHeight + 'px'
            element.style.overflow = 'visible'
            if (callback) callback()
        }
    }
    requestAnimationFrame(animateHeight)
}
function collapseElement(element, duration = 200, callback) {
    let startHeight = element.scrollHeight
    element.style.overflow = 'hidden'
    let startTime = null
    function animateHeight(timestamp) {
        if (!startTime) startTime = timestamp
        let progress = timestamp - startTime
        let fraction = Math.min(progress / duration, 1)
        let currentHeight = startHeight - fraction * startHeight
        element.style.height = currentHeight + 'px'
        if (fraction < 1) {
            requestAnimationFrame(animateHeight)
        } else {
            element.style.height = "0"
            if (callback) callback()
        }
    }
    requestAnimationFrame(animateHeight)
}
const menuToggleBtn = document.getElementById('menuToggleBtn')
const menuOverlay = document.getElementById('menuOverlay')
let overlayOpen = false
menuToggleBtn.addEventListener('click', () => {
    if (!overlayOpen) {
        fadeIn(menuOverlay, 500)
        overlayOpen = true
    } else {
        fadeOut(menuOverlay, 500)
        overlayOpen = false
    }
})
const menuLabels = document.querySelectorAll('.menu-label')
let currentlyOpenSubMenu = null
menuLabels.forEach(label => {
    label.addEventListener('click', () => {
        const subMenu = label.nextElementSibling
        if (currentlyOpenSubMenu && currentlyOpenSubMenu !== subMenu) {
            collapseElement(currentlyOpenSubMenu, 200)
        }
        if (currentlyOpenSubMenu === subMenu) {
            collapseElement(subMenu, 200)
            currentlyOpenSubMenu = null
        } else {
            expandElement(subMenu, 200)
            currentlyOpenSubMenu = subMenu
        }
    })
})
