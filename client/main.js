$(document).ready(function() {
  $("#move-form-submit").click(function (e) {
    console.log("Saving move to database");
    //Assign form variables
    var button = e.target;

    //Disable button and show message
    $(button).text("Saving...");
    $(button).attr("disabled","");

    var stationNumber = $("#stationNumber").val();
    var transport = $("#transport:checked").val();

    console.log("Station: " + stationNumber);
    console.log("transport = " + transport);

    if (!stationNumber || isNaN(stationNumber)) {
      console.log("Station is not a number!");
      resetButton(button, "Save");
      return;
    }

    resetButton(button, "Save");
  });

  /*
  * Reset a button after form processing is complete
  */
  function resetButton(button, text) {
    $(button).removeAttr("disabled");
    $(button).text(text);
  }
});
