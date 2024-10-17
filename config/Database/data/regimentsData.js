const regiments = [
  {
    building: null,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    activities: ["Gym", "Swimming"],
  },
  {
    building: null,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    activities: ["Yoga", "Hiking"],
  },
];

module.exports = regiments;
