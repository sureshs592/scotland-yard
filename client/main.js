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
var stationGap = 50;
var stationRadius = 7;

$(document).ready(function() {

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
    var player = $("#player:checked").val();

    saveMove(player, stationNumber, transport);

    $(button).removeAttr("disabled");
    $(button).text("Save");
  });

  $("#test").click(function (e) {
    renderTrail("thief");
    renderTrail("detective-1");
    renderTrail("detective-2");
    renderTrail("detective-3");
    renderTrail("detective-4");
    renderTrail("detective-5");
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

    var lastMove = Moves.findOne({"game": gameID, "player": playerType}, {sort: [["order", "desc"]]});
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

  function renderTrail(player) {
    var divID = "#" + player + "-div";
    var div = $(divID);
    var canvasID = "#" + player + "-canvas";
    var canvas = $(canvasID);
    var infoID = "#" + player + "-info";
    var info = $(infoID);

    //Get all moves made by the player
    var games = Games.find({}).fetch();
    var gameID = games[0]._id;
    var moves = Moves.find({"game": gameID, "player": playerType}, {sort: [["order", "desc"]]}).fetch();
    console.log(moves);

    renderSVG(canvas, moves);
    renderInfo(info, moves);

    //Hack to make the inserted SVG visible
    $(div).html($(div).html());
    return true;
  }

  function renderSVG(canvas, moves) {
    //Flush existing trail
    var lineObjs = $(canvas).find("line");
    $(lineObjs).remove();
    var circleObjs = $(canvas).find("circle");
    $(circleObjs).remove();

    var stations = new Array();
    var paths = new Array();

    //Starting point of the trail
    var cx = 12, cy = 10;
    var startingPoint = createStation("s_0", "station", cx, cy, stationRadius);
    stations.push(startingPoint);

    //Prepare paths and stations for subsequent moves
    for (var i = 0; i < moves.length; i++) {
      var move = moves[i];
      var idAppend = "_" + (i + 1);
      var clazz = "path " + move.transport;
      var path = createTrip("p" + idAppend, clazz, cx, cy);
      cy += stationGap;
      var station = createStation("s" + idAppend, "station", cx, cy, stationRadius);

      paths.push(path);
      stations.push(station);
    }

    //Render all paths and stations
    for (var i = 0; i < paths.length; i++) { $(canvas).append(paths[i]); }
    for (var i = 0; i < stations.length; i++) { $(canvas).append(stations[i]); }

    return true;
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
