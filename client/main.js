//TEMP CODE: Getting the game ID
// var games = Games.find({}).fetch();
// var gameID = games[0]._id;
//END OF TEMP CODE

$(document).ready(function() {
  //Render map once the page has loaded
  renderMapTrail("thief");

  //Trigger form to save a move
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

    $(button).removeAttr("disabled");
    $(button).text("Save");
  });
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

  var games = Games.find({}).fetch();
  var gameID = games[0]._id;

  var lastMove = Moves.findOne({"game": gameID}, {sort: [["order", "desc"]]});
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

  Moves.insert(newMove);
}
//<circle cx="10" cy="10" r="6" class="station" id="s_1"></circle>
function renderMapTrail(player) {
  console.log("Rendering map trail");
  var canvasID = "#" + player + "-canvas";
  var divID = "#" + player + "-canvas-div";
  var canvas = $(canvasID);
  console.log(canvas);

  //Starting point of the trail
  var startingPoint = createStation("s_0", "station", 10, 10, 6);
  $(canvas).append(startingPoint);

  //Start rendering subsequent moves
  var games = Games.find({}).fetch();
  var gameID = games[0]._id;
  var moves = Moves.find({"game": gameID}).fetch();
  console.log();

  //Hack to make the inserted SVG visible
  $(divID).html($(divID).html());
}

function createStation(id, clazz, cx, cy, r) {
  var circle = document.createElement("circle");
  $(circle).addClass(clazz);
  $(circle).attr("id", id);
  $(circle).attr("cx", cx);
  $(circle).attr("cy", cy);
  $(circle).attr("r", r);
  return circle;
}

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
