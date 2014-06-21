$(document).ready(function() {
  $("#move-form-submit").click(function (e) {
    //Assign form variables
    var button = e.target;

    //Disable button and show message
    $(button).text("Saving...");
    $(button).attr("disabled","");

    //Getting input values
    var stationNumber = $("#stationNumber").val();
    var transport = $("#transport:checked").val();

    saveMove("thief", stationNumber, transport);

    //End of method. Resetting button
    resetButton(button, "Save");
  });

  /*
  * Function to save the move of a player
  */
  function saveMove(playerType, stationNumber, transport) {
    //Checking if the station number is valid
    if (!stationNumber || isNaN(stationNumber)) {
      console.log("Station is not a number!");
      return;
    }

    //TEMP CODE: Getting the game ID
    var games = Games.find().fetch();
    var gameID = games[0]._id;
    //END OF TEMP CODE

    var lastMove = Moves.findOne({"game": gameID}, {sort: [["order", "asc"]]});
    var moveOrder = (lastMove) ? lastMove.order + 1 : 1 ;

    //Creating new move document and storing it
    var newMove = {
      game: gameID,
      order: moveOrder,
      time: new Date(),
      player: playerType,
      station: stationNumber,
      transport: transport,
    };

    Moves.insert(newMove, function (err, id) {
      if (err) {
        console.log(err);
      } else {
        console.log(id);
      }
    });
  }

  /*
  * Reset a button after form processing is complete
  */
  function resetButton(button, text) {
    $(button).removeAttr("disabled");
    $(button).text(text);
  }
});

Template.mapTrail.helpers({
  stations: function() {
    return Moves.find().fetch();
  }
});

Template.station.helpers({
  moveTime: function() {
    return this.time.getHours() + ":" + this.time.getMinutes();
  }
});
