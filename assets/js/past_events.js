const { createApp } = Vue; // en esta linea se desestrucutra Vue, es igual a poner Vue.createApp

createApp({
  data() {
    return {
      pastEvents: [],
      currentDate: "",
      filteredEvents: [],
      categories: [],
      checked: [],
      searchValue: "",
    };
  },
  created() {
    fetch("../assets/amazing.json")
      .then((res) => res.json())
      .then((data) => {
        this.currentDate = data.currentDate
        this.pastEvents = data.events.filter(event => event.date < this.currentDate);
        this.filteredEvents = this.pastEvents
        this.categories = Array.from(
          new Set(this.pastEvents.map((event) => event.category))
        );
      })
      .catch((err) => console.log(err));
  },
  methods: {
    filter() {
      this.filteredEvents = this.pastEvents.filter(event => 
          (this.checked.includes(event.category) ||
            this.checked.length === 0) &&
          event.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    },
  },
}).mount("#app")
