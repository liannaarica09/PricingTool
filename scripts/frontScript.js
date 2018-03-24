$(document).ready(function () {
  $(".mWTab").hide();
  $(".electOTab").hide();
  $(".brandTab").show();
  $(".table").hide();
  $("#top_x_div").hide();
  document.getElementById("input").disabled = true;

  var config = {
    apiKey: "AIzaSyCeu8LNzpEl4vmP-_Gm4pRL04krzERMLDs",
    authDomain: "pricingtool-7ba32.firebaseapp.com",
    databaseURL: "https://pricingtool-7ba32.firebaseio.com",
    projectId: "pricingtool-7ba32",
    storageBucket: "",
    messagingSenderId: "53201548843",
  };

  firebase.initializeApp(config);
  var db = firebase.database();


  var clothingNonClothing = "clothing";
  var mensWomens = "mens";
  var category = "t-shirt";

  $("#graphTab").on("click", function (event) {
    event.preventDefault();
    $("#top_x_div").toggle();
  });

  $("#clothingTab").on("click", function (event) {
    event.preventDefault();
    document.getElementById("input").disabled = true;
    $("#menSelect").prop("selectedIndex", 0);
    $("#womenSelect").prop("selectedIndex", 0);
    $("#otherSelect").prop("selectedIndex", 0);
    $("#electronicsSelect").prop("selectedIndex", 0);
    $(".electOTab").hide();
    $(".mWTab").toggle();
    $("#clothingTab").attr("style", "-webkit-box-shadow: -4px 4px 6px 1px rgba(162,118,175,1); - moz - box - shadow: -4px 4px 6px 1px rgba(162, 118, 175, 1); box - shadow: -4px 4px 6px 1px rgba(162, 118, 175, 1);");
    $("#nonClothingTab").removeAttr("style");
  });

  $("#nonClothingTab").on("click", function (event) {
    event.preventDefault();
    document.getElementById("input").disabled = true;
    $("#menSelect").prop("selectedIndex", 0);
    $("#womenSelect").prop("selectedIndex", 0);
    $("#otherSelect").prop("selectedIndex", 0);
    $("#electronicsSelect").prop("selectedIndex", 0);
    $(".mWTab").hide();
    $(".electOTab").toggle();
    $("#nonClothingTab").attr("style", "-webkit-box-shadow: -4px 4px 6px 1px rgba(162,118,175,1); - moz - box - shadow: -4px 4px 6px 1px rgba(162, 118, 175, 1); box - shadow: -4px 4px 6px 1px rgba(162, 118, 175, 1);");
    $("#clothingTab").removeAttr("style");
  });

  $("#usedTab").on("click", function (event) {
    event.preventDefault();
    $("#graphTab").text("Used Graph");
  });
  $("#newTab").on("click", function (event) {
    event.preventDefault();
    $("#graphTab").text("New Graph");
  });
  $("#listTab").on("click", function (event) {
    event.preventDefault();
    $("#displayItems").toggle();
  });
  $("#recentTab").on("click", function (event) {
    event.preventDefault();
    $(".recentItem").toggle();
  });

  $(document).on("click touchstart", ".boxers", function (event) {
    event.preventDefault();
    var clickItem = $(this).html();
    db.ref("recentItems").push({
      thisAll: $(this).parent(".recentTR").html(),
    });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
  db.ref("recentItems").on("child_added", function (snap) {
    console.log(snap.val().thisAll);
    $("#recentTable").prepend("<tr>" + snap.val().thisAll + "</tr>");
  });

  // Created for an Articles on:
  // https://www.html5andbeyond.com/bubbling-text-effect-no-canvas-required/

  jQuery(document).ready(function ($) {

    // Define a blank array for the effect positions. This will be populated based on width of the title.
    var bArray = [];
    // Define a size array, this will be used to vary bubble sizes
    var sArray = [4, 6, 8, 10];

    // Push the header width values to bArray
    for (var i = 0; i < $('.bubbles').width(); i++) {
      bArray.push(i);
    }

    // Function to select random array element
    // Used within the setInterval a few times
    function randomValue(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    // setInterval function used to create new bubble every 350 milliseconds
    setInterval(function () {

      // Get a random size, defined as variable so it can be used for both width and height
      var size = randomValue(sArray);
      // New bubble appeneded to div with it's size and left position being set inline
      // Left value is set through getting a random value from bArray
      $('.bubbles').append('<div class="individual-bubble" style="left: ' + randomValue(bArray) + 'px; width: ' + size + 'px; height:' + size + 'px;"></div>');

      // Animate each bubble to the top (bottom 100%) and reduce opacity as it moves
      // Callback function used to remove finsihed animations from the page
      $('.individual-bubble').animate({
        'bottom': '100%',
        'opacity': '-=0.7'
      }, 3000, function () {
        $(this).remove();
      });


    }, 350);

  });
});