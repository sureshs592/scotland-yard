Meteor.startup(function() {
  if (Games.find().count() === 0) {
    var newGame = {
      name: "default"
    };
    Games.insert(newGame);
  }
});
