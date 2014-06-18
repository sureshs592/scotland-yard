if (Meteor.isClient) {
  drawCanvas();
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

function drawCanvas() {
  
}
