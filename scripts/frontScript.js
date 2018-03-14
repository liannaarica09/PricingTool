$(document).ready(function() {
  $(".mWTab").hide();
  $(".electOTab").hide();
  $(".brandTab").show();
  $(".table").hide();
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

  $("#graphTab").on("click", function(event) {
    event.preventDefault();
    $("#top_x_div").toggle();
  });

  $("#clothingTab").on("click", function(event) {
    event.preventDefault();
    $("#menSelect").prop("selectedIndex", 0);
    $("#womenSelect").prop("selectedIndex", 0);
    $("#otherSelect").prop("selectedIndex", 0);
    $(".electOTab").hide();
    $(".mWTab").toggle();
  });

  $("#nonClothingTab").on("click", function(event) {
    event.preventDefault();
    $("#menSelect").prop("selectedIndex", 0);
    $("#womenSelect").prop("selectedIndex", 0);
    $("#otherSelect").prop("selectedIndex", 0);
    $(".mWTab").hide();
    $(".electOTab").toggle();
  });

  $("#usedTab").on("click", function(event) {
    event.preventDefault();
    $("#graphTab").text("Used Graph");
  });
  $("#newTab").on("click", function(event) {
    event.preventDefault();
    $("#graphTab").text("New Graph");
  });
  $("#listTab").on("click", function(event) {
    event.preventDefault();
    $("#displayItems").toggle();
  });
  $("#recentTab").on("click", function(event) {
    event.preventDefault();
    $(".recentItem").toggle();
    db.ref("recentItems").on("child_added", function(snap) {
        console.log(snap.val());
    })
  });

  $(document).on("click", ".boxers", function(event) {
    event.preventDefault();
    db.ref("recentItems").push({
      recentItem: $(this).siblings()
    });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0; 
  })
});
