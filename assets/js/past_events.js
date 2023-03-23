import { getDataPages } from "./functions.js";

let events
let currentDate
let categories
let pastEvents
const cardFragment = document.createDocumentFragment();
let cards = document.getElementById("cards")
const checkboxFragment = document.createDocumentFragment();
let checkboxes = document.getElementById("category-checkbox")
const searchBox = document.getElementById("search-box")


getDataPages()
.then(data => {
    events = data.events
    currentDate = data.currentDate
    pastEvents = events.filter(event => event.date < currentDate)
    console.log(events)
    console.log(currentDate)
    categories = Array.from(new Set(events.map(element => element.category)))
    console.log(categories)
    printPastEvents(pastEvents, cards)
    displayCategories(categories, checkboxes)
})

function printPastEvents(array, cards) {
    cards.innerHTML = ""
    array.forEach(event => {
            let divCard = document.createElement('div');
            divCard.className = "card border-0 mx-1 mt-3 rounded-1 overflow-hidden"
            divCard.innerHTML += `
            <img src="${event.image}" class=" card-img-top" alt="card image">
            <div class="card-body">
                <h5 class="card-title">${event.name}</h5>
                <p class="badge fs-medium bg-info m-0">${event.category}</p>
                <p class="fw-bold mb-2 mt-2">Price $${event.price}</p>
                <div class="price d-flex justify-content-center">
                    <a class="btn btn-danger" href="/pages/details.html?id=${event._id}">Read more</a>
                </div>
            </div>
            `
            cardFragment.appendChild(divCard)
    })
    cards.appendChild(cardFragment)
}

/*Display category checkboxes*/

function displayCategories(array, checkboxes) {
    array.forEach(category => {
        let categoryDiv = document.createElement('div');
        categoryDiv.className = "form-check form-check-inline"
        categoryDiv.innerHTML += `
                    <input class="form-check-input" type="checkbox" id="${category}" value="${category}">
                    <label class="form-check-label category-label" for="${category}">${category}</label>
                    `
        checkboxFragment.appendChild(categoryDiv);
    })
    checkboxes.appendChild(checkboxFragment)
}

/*Search Box Filter*/

const searchFilter = (array) => {
    let filteredArray = array.filter(event => event.name.toLowerCase().includes(searchBox.value.toLowerCase().trim()))
    console.log(filteredArray)
    if (filteredArray > 1) {
        return array
    } else {
        return filteredArray
    }
}

searchBox.addEventListener('keyup', (e) => {
    let crossArray = crossFilter(pastEvents)
    if (crossArray < 1) {
        const div = document.querySelector('#cards')
        div.innerHTML = `
            <div class="card-body">
                <h5 class="card-title text-white text-center">Nothing found</h5>
            </div>
            `
    } else {
        printPastEvents(crossArray, cards)
    }
})

/*Checkbox filter*/

const checkboxFilter = (array) => {
    let checked = document.querySelectorAll('input[type=checkbox]:checked')
    let checkedValues = [...checked].map(checkbox => checkbox.value.toLowerCase())
    console.log(checkedValues)
    let filteredArray = array.filter(event => checkedValues.indexOf(event.category.toLowerCase()) !== -1)
    if (filteredArray < 1) {
        return array
    } else {
        return filteredArray
    }
}

checkboxes.addEventListener('change', (e) => {
    let crossArray = crossFilter(pastEvents)
    if (crossArray < 1) {
        const div = document.querySelector('#cards')
        div.innerHTML = `
            <div class="card-body">
                <h5 class="card-title text-white text-center">Nothing found</h5>
            </div>
            `
    } else {
        printPastEvents(crossArray, cards)
    }
})

/*Cross Filter*/
function crossFilter(array) {
    let crossArray = checkboxFilter(array)
    crossArray = searchFilter(crossArray)
    return crossArray
}

