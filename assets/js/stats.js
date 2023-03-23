import { getDataPages } from "./functions.js";

let events
let currentDate
let categories
let eventsHighAttendance
let eventsLowAttendance
let eventLargeCapacity
let pastEvents
let upcomingEvents
let tableEvents = document.getElementById('body-event-stats')
let tableEventFragment = document.createDocumentFragment()
let tableUpcomingByCategory = document.getElementById('body-upcoming-events-by-category')
let upcomingByCategoryFragment = document.createDocumentFragment()
let tablePastByCategory = document.getElementById('body-past-events-by-category')
let pastByCategoryFragment = document.createDocumentFragment()

getDataPages()
    .then(data => {
        events = data.events
        currentDate = data.currentDate;
        categories = Array.from(new Set(events.map(element => element.category)))
        eventsHighAttendance = events.filter(event => calcAttendance(event) > 98)
        eventsLowAttendance = events.filter(event => calcAttendance(event) < 75)
        eventLargeCapacity = getLargerCapacityEvent(events)
        fillEventStats(eventsHighAttendance, eventsLowAttendance, eventLargeCapacity, tableEvents, tableEventFragment)
        pastEvents = categoriesStats2Array(getCategoryStats(events, "past"))
        displayCategoryStatistics(pastEvents, tablePastByCategory, upcomingByCategoryFragment)
        upcomingEvents = categoriesStats2Array(getCategoryStats(events, "upcoming"))
        displayCategoryStatistics(upcomingEvents, tableUpcomingByCategory, pastByCategoryFragment)
    })

function calcAttendance(event) {
    let assistance = event.assistance
    let capacity = event.capacity
    let attendance = (assistance / capacity) * 100
    console.log(attendance)
    return attendance
}

function getLargerCapacityEvent(array) {
    let largerCapacity = 0
    let largerCapacityEvent = {}
    array.forEach(event => {
        if (event.capacity > largerCapacity) {
            largerCapacity = event.capacity
            largerCapacityEvent = event
        }
    })
    console.log(largerCapacityEvent)
    return largerCapacityEvent.name
}

function fillEventStats(highAtt, lowAtt, largeCap, table, fragment) {
    let highAttendance = (highAtt.map(event => event.name)).join(" - ")
    let lowAttendance = (lowAtt.map(event => event.name)).join(" - ")
    let largeCapacity = largeCap

    let tableRow = document.createElement('tr')
    tableRow.innerHTML += `
            <td>${highAttendance}</td>
            <td>${lowAttendance}</td>
            <td>${largeCapacity}</td>
            `
    fragment.appendChild(tableRow)

    table.appendChild(fragment)
}

function getFilteredbyTense(events, eventTense) {
    let filteredEvents = [];

    if (eventTense === "upcoming") {
        filteredEvents = events.filter(event => event.date > currentDate);
        return filteredEvents
    } else if (eventTense === "past") {
        filteredEvents = events.filter(event => event.date < currentDate);
        return filteredEvents
    }
}

function getCategoryStats(events, eventTense) {
    let filteredEvents = getFilteredbyTense(events, eventTense)
    const categoriesStats = {};

    filteredEvents.forEach(event => {
        if (!categoriesStats[event.category]) {
            categoriesStats[event.category] = {
                name: event.category,
                revenue: 0,
                attendance: 0,
                capacity: 0,
                eventCount: 0,
                attendancePercentage: ""
            }
        };
        const attendance = event.assistance || event.estimate;
        const revenue = event.price * attendance;
        categoriesStats[event.category].revenue += revenue;
        categoriesStats[event.category].attendance += attendance;
        categoriesStats[event.category].eventCount++;
        categoriesStats[event.category].capacity += event.capacity;
    });
    
    return categoriesStats
}

function categoriesStats2Array(categoriesStats) {
    let categoriesArray = []
    for (const category in categoriesStats) {
        const attendancePercentage = ((categoriesStats[category].attendance * 100) / categoriesStats[category].capacity).toFixed(2);
        categoriesStats[category].attendancePercentage += attendancePercentage + "%";

    categoriesArray = Object.values(categoriesStats).map(({ name, revenue, attendance, capacity, attendancePercentage }) =>
        ({ name, revenue, attendance, capacity, attendancePercentage }));
    }
    categoriesArray.sort((a, b) => a.revenue - b.revenue)
    console.log(categoriesArray)
    return categoriesArray
}

function displayCategoryStatistics(array, table, fragment) {
    array.forEach((element) => {
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${element.name}</td>
        <td>$${element.revenue.toLocaleString()}</td>
        <td>${element.attendancePercentage}</td>
        `
        fragment.appendChild(row);
    });
    table.appendChild(fragment);
}
