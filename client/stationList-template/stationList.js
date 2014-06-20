Template.stationList.helpers({
  stations: function() {
    return Moves.find();
  }
});
