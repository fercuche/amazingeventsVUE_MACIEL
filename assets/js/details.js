const { createApp } = Vue; // en esta linea se desestrucutra Vue, es igual a poner Vue.createApp

createApp({
  data() {
    return {
      events: [],
      eventDetail: [],
    };
  },
  created() {
    fetch("../assets/amazing.json")
      .then((res) => res.json())
      .then((data) => {
        let queryString = location.search;
        let id = new URLSearchParams(queryString).get("id")

        this.events = data.events;
        console.log(this.events)
        this.eventDetail = this.events.find((event) => event._id == id);
        console.log(this.eventDetail);

      })
      .catch((err) => console.log(err));
  },
  methods: {},
}).mount("#app");

// let events
// let eventDetail
// const queryString = location.search
// const params = new URLSearchParams(queryString)
// const id = params.get("id")

// console.log(eventDetail)
// getDataPages()
//   .then(data => {
//     events = data.events
//     eventDetail = events.find(event => event._id == id)
//     let eventDate = showDate(eventDetail.date)
//     displayDetails(eventDetail, eventDate)
//   })

// function showDate(date) {
//   let eventDate = new Date(date).toUTCString()
//   return eventDate.slice(5, 16)
// }
// function displayDetails(eventDetail, eventDate) {
//     const div = document.querySelector('#main-details')
//     div.innerHTML = `
//     <div class="card flex-lg-row flex-xl-row mx-5 rounded-2 overflow-hidden align-items-center" id="details">
//     <img src="${eventDetail.image}" class="details-img" alt="...">
//     <div class="card-body">
//     <h2 class="card-title text-center">${eventDetail.name}</h2>
//     <ul class="card-text list-unstyled">
//         <li class="text-center fst-italic">${eventDate}</li>
//         <li class="badge fs-medium bg-info m-1">${eventDetail.category}</li>
//         <li class="text-start p-1">${eventDetail.description}</li>
//         <li class="m-1"><i class="bi bi-geo-alt-fill text-danger"></i> ${eventDetail.place}</li>
//         <li class="m-1"><i class="bi bi-people-fill text-primary"></i> Capacity ${eventDetail.capacity}</li>
//         <li class="h3 fw-bolder my-2 text-center">$${eventDetail.price}</li>
//     </ul>
//   </div>
//   </div>
//   `
// }

// /*Return button*/

// const returnButton = document.getElementById('returnButton');

// returnButton.addEventListener('click', () => {
//   window.history.back();
// });
