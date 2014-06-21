Template.mapTrail.helpers({
  stations: function() {
    return Moves.find().fetch();
  }
});

Template.station.helpers({
  moveTime: function() {
    return this.time.getHours() + ":" + this.time.getMinutes();
  }
})
