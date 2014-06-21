//TEMP CODE: Getting the game ID
// var games = Games.find({}).fetch();
// var gameID = games[0]._id;
//END OF TEMP CODE
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

//CONSTANTS
var stationGap = 40;

$(document).ready(function() {
  //Render map once the page has loaded
  // renderMapTrail("thief");

  //Trigger form to save a move
  $("#move-form-submit").click(function (e) {
    // Assign form variables
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

  $("#test").click(function (e) {
    renderMapTrail("thief");
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

  function renderMapTrail(player) {
    console.log("Rendering map trail");
    var canvasID = "#" + player + "-canvas";
    var divID = "#" + player + "-canvas-div";
    var canvas = $(canvasID);
    var stations = new Array();
    var paths = new Array();

    //Get all moves made by the player
    var games = Games.find({}).fetch();
    var gameID = games[0]._id;
    var moves = Moves.find({"game": gameID}).fetch();
    console.log(moves);

    //Starting point of the trail
    var cx = 10, cy = 10;
    var startingPoint = createStation("s_0", "station", cx, cy, 6);
    stations.push(startingPoint);

    //Prepare paths and stations for subsequent moves
    for (var i = 0; i < moves.length; i++) {
      var move = moves[i];
      var idAppend = "_" + (i + 1);
      var clazz = "path " + move.transport;
      var path = createTrip("p" + idAppend, clazz, cx, cy);
      cy += stationGap;
      var station = createStation("s" + idAppend, "station", cx, cy, 6);

      paths.push(path);
      stations.push(station);
    }

    //Render all paths and stations
    for (var i = 0; i < paths.length; i++) { $(canvas).append(paths[i]); }
    for (var i = 0; i < stations.length; i++) { $(canvas).append(stations[i]); }

    //Hack to make the inserted SVG visible
    $(divID).html($(divID).html());
    return;
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

  function createTrip(id, clazz, x1, y1) {
    var path = document.createElement("line");
    $(path).addClass(clazz);
    $(path).attr("id", id);
    $(path).attr("x1", x1);
    $(path).attr("y1", y1);
    $(path).attr("x2", x1);
    $(path).attr("y2", y1 + stationGap);
    return path;
  }
});
