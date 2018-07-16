$(document).ready(function () {
  var item = "anthropologie";
  var category = "63861";
  var highest = 0;
  var lowest = 100000000000;
  var totals = [];
  var totalsRound = [];
  var Shipping = "";
  var totalNumber = "";
  var queryURL = "";
  var body = $("#itemsTable");
  var head = $("#pricingTable");
  var freq;
  var freqVal;
  var p = 1;
  var result = {};
  var runningTally = 0;

  var categoryId;
  var conditionUsed = "&itemFilter(1).name=Condition&itemFilter(1).value=3000";
  var conditionNew = "&itemFilter(1).name=Condition&itemFilter(1).value=1000";
  var condition = "&itemFilter(1).name=Condition&itemFilter(1).value=3000";
  var clothing = false;

  function modes(array) {
    if (!array.length) return [];
    var modeMap = {},
      maxCount = 0,
      modes = [];

    array.forEach(function (val) {
      if (!modeMap[val]) modeMap[val] = 1;
      else modeMap[val]++;

      if (modeMap[val] > maxCount) {
        modes = [val];
        maxCount = modeMap[val];
      } else if (modeMap[val] === maxCount) {
        modes.push(val);
        maxCount = modeMap[val];
      }
    });
    return modes;
  }

  $('input[type="checkbox"]').on("click", function () {
    if (this.checked) {
      condition = conditionNew;

      console.log("new");
      console.log(condition);
    } else {
      condition = conditionUsed;

      console.log("unchecked");
      console.log(condition);
    }
  });

  $("#submit").on("click", function () {
    $(".twelveSon").children(".errorMsg").remove();
    $("#itemsTable").empty();
    if (clothing === true) {
      item = $("#input").val();
      console.log(item);
      getData();
    }
    if (clothing === false) {
      if ($("#input").val() === "") {
        var errorDisplay = $("<p>");
        errorDisplay.addClass("errorMsg");
        $(".twelveSon").append(errorDisplay.text("Please enter a search term."));
        return;
      }
      item = $("#input").val();
      getBestBuyData();
    }
  });
  console.log($("#itemsTable").html());

  function getBestBuyData() {
    queryURL =
      "https://api.bestbuy.com/v1/products((search=" +
      item +
      ")&(categoryPath.id=" +
      categoryId +
      "))?apiKey=aZbPaFdEwGA1IMWTXeQt0ONL&sort=image.asc&show=image,modelNumber,name,regularPrice,shipping,thumbnailImage&format=json&pageSize=100";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      if (!('0' in response.products)) {
        var errorDisplay = $("<p>");
        errorDisplay.addClass("errorMsg");
        $(".twelveSon").append(errorDisplay.text("Sorry, your search returned 0 results. Please try again"));
        return;
      }
      for (i = 0; i < response.products.length; i++) {
        var newRow = $("<tr>");
        var picture = $("<td>").html(
          "<img src=" +
          response.products[i].image +
          " alt='img' 'height=100px' width='100px'>"
        );
        var Title = $("<td>").text(response.products[i].name);
        var Price = $("<td>").text(response.products[i].regularPrice);
        Title.addClass("boxers");
        newRow.append(picture);
        newRow.append(Title);
        newRow.append(Price);

        var Shipping = $("<td>").text("$0.00");
        var Total = $("<td>").text(response.products[i].regularPrice);

        newRow.append(Shipping);
        newRow.append(Total);
        body.append(newRow);
      }
      item = "";
      console.log(response);
    });
  }

  function getData() {
    //debugger;
    queryURL =
      "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=MaureenB-Improved-PRD-a5d7504c4-a5fecda0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=" +
      item +
      "&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value=true" +
      condition +
      "&paginationInput.pageNumber=1&categoryId=" +
      categoryId;

    console.log("Entered getData");
    console.log(queryURL);
    console.log(category);
    console.log(item);
    console.log(condition);

    google.charts.load("current", {
      packages: ["bar"]
    });

    function drawStuff() {
      var data = new google.visualization.DataTable();

      data.addColumn('string', 'price');
      data.addColumn('number', 'frequencyValue');

      // load data
      for (var j = 0; j < freq.length; j++) {
        var row = [freq[j].toString(), freqVal[j]];
        data.addRow(row);
      }

      var options = {
        legend: {
          position: 'none'
        },
        chart: {
          title: 'Distribution Chart',
          subtitle: 'number of items sold at this pirce point, rounded to the nearest dollar'
        },
        chartArea: {
          left: '-50%',
          width: '50%'
        },
        backgroundColor: {
          fill: '#C8EBD0',
          fillOpacity: 1.0,
          stroke: '#48EB6C',
          strokeWidth: '1',
        },
        bars: 'horizontal', // Required for Material Bar Charts.
        series: {
          0: {
            axis: 'freq'
          }, // Bind series 0 to an axis named 'distance'.
          1: {
            axis: 'items'
          } // Bind series 1 to an axis named 'brightness'.
        },
        axis: {
          x: {
            freq: {
              label: 'Number of items sold'
            }, // Bottom x-axis.
            items: {
              label: 'apparent magnitude'
            } // Top x-axis.
          },
          0: {
            color: '#3CC95B'
          }
        }
      };

      var chart = new google.charts.Bar(document.getElementById("top_x_div"));
      $("#graphTab").on("click", function (event) {
        event.preventDefault();
        chart.draw(data, options);
      });
      chart.draw(data, google.charts.Bar.convertOptions(options));
    }

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      result = JSON.parse(response);

      console.log(result);

      if (!('item' in result.findCompletedItemsResponse[0].searchResult[0])) {
        queryURL = "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=getSearchKeywordsRecommendation&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=MaureenB-Improved-PRD-a5d7504c4-a5fecda0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=" + item;
        $.ajax({
          url: queryURL,
          method: "GET",
        }).then(function (response) {
          result = JSON.parse(response);
          console.log(result);
          var newWord = result.getSearchKeywordsRecommendationResponse[0].keywords;
          var errorDisplay = $("<p>");
          errorDisplay.addClass("errorMsg");
          $(".twelveSon").append(errorDisplay.html("Sorry, your search returned 0 results. Did you mean <i>" + newWord + "</i>?"));
        });
        return;
      }
      console.log(result.findCompletedItemsResponse[0].searchResult[0].item.length);
      for (var i = 0; i < result.findCompletedItemsResponse[0].searchResult[0].item.length; i++) {
        var newRow = $("<tr>");
        var picture = $("<td>").html(
          "<img src=" +
          result.findCompletedItemsResponse[0].searchResult[0].item[i]
            .galleryURL +
          "alt='img'>"
        );
        var Title = $("<td>").text(
          result.findCompletedItemsResponse[0].searchResult[0].item[i].title
        );
        var Price = $("<td>").text(
          result.findCompletedItemsResponse[0].searchResult[0].item[i]
            .sellingStatus[0].currentPrice[0].__value__
        );
        Title.addClass("boxers");
        newRow.append(picture);
        newRow.append(Title);
        newRow.append(Price);
        newRow.addClass("recentTR");

        totals.push(totalNumber);
        totalsRound.push(Math.round(totalNumber));
        console.log(totalNumber);
        runningTally += totalNumber;
        // console.log(runningTally.toFixed(2));

        if (
          result.findCompletedItemsResponse[0].searchResult[0].item[i].shippingInfo[0].hasOwnProperty("shippingServiceCost")
        ) {
          Shipping = $("<td>").text(
            result.findCompletedItemsResponse[0].searchResult[0].item[i]
              .shippingInfo[0].shippingServiceCost[0].__value__
          );

          totalNumber =
            Number(
              result.findCompletedItemsResponse[0].searchResult[0].item[i]
                .sellingStatus[0].currentPrice[0].__value__
            ) +
            Number(
              result.findCompletedItemsResponse[0].searchResult[0].item[i]
                .shippingInfo[0].shippingServiceCost[0].__value__
            );
        } else {
          Shipping = $("<td>").text("$0.00");

          totalNumber =
            Number(
              result.findCompletedItemsResponse[0].searchResult[0].item[i]
                .sellingStatus[0].currentPrice[0].__value__
            ) + 0;
        }

        var total = $("<td>").text(totalNumber.toFixed(2));
        //create arrays for math and graphs
        totals.push(totalNumber);
        totalsRound.push(Math.round(totalNumber));

        newRow.append(Shipping);
        newRow.append(total);
        body.append(newRow);
      }
      item = "";

      function createFreq(arry) {
        arry.sort(function (a, b) {
          return a - b;
        });
        var a = [];
        var b = [];
        var prev;
        console.log(arry);

        for (var i = 0; i < arry.length; i++) {
          if (arry[i] !== prev) {
            a.push(arry[i]);
            b.push(1);
          } else {
            b[b.length - 1]++;
          }
          prev = arry[i];
        }

        freq = a;
        freqVal = b;
        console.log(arry);
      }

      if (totalNumber.toFixed(2) > Number(highest)) {
        console.log(highest);
        console.log(totalNumber);
        highest = totalNumber.toFixed(2);
        console.log("New high price: " + totalNumber.toFixed(2));
      }

      if (totalNumber.toFixed(2) < Number(lowest)) {
        console.log(lowest);
        console.log(totalNumber);
        lowest = totalNumber.toFixed(2);
        console.log("New low price: " + totalNumber.toFixed(2));
      }

      // math stuff
      totals.sort(function (a, b) {
        return a - b;
      });
      totalsRound.sort(function (a, b) {
        return a - b;
      });
      // console.log(totals);
      // console.log(totalsRound);

      createFreq(totalsRound);

      var lowMiddle = Math.floor((totals.length - 1) / 2);
      console.log("lowMiddle " + lowMiddle);
      var highMiddle = Math.ceil((totals.length - 1) / 2);
      console.log("highMiddle " + highMiddle);
      var mean = parseFloat(runningTally).toFixed(2) / result.findCompletedItemsResponse[0].searchResult[0].item.length;
      console.log("Mean: " + parseFloat(runningTally).toFixed(2) + "/" + result.findCompletedItemsResponse[0].searchResult[0].item.length + " = " + mean);
      var median = (totals[lowMiddle] + totals[highMiddle]) / 2;
      console.log("median " + median);

      var importantRow = $("<tr>");

      var priceRange = $("<td>").text(lowest + "-" + highest);
      var meanPrice = $("<td>").text(mean.toFixed(2));
      var medianPrice = $("<td>").text(median.toFixed(2));
      var modePrice = $("<td>").text(modes(totals));
      var roundedMode = $("<td>").text(modes(totalsRound));
      var numberOfItems = $("<td>").text(result.findCompletedItemsResponse[0].searchResult[0].item.length);

      importantRow.append(numberOfItems);
      importantRow.append(priceRange);
      importantRow.append(meanPrice);
      importantRow.append(medianPrice);
      importantRow.append(modePrice);
      importantRow.append(roundedMode);
      $("#pricingTable").append(importantRow);
      $("#tableOne").attr("style", "display:block");


      createFreq(totalsRound);
      drawStuff();

      $(window).resize(function () {
        drawStuff();
      });
    });
  }


  $("#menSelect").on("change", function () {
    $("#input").val("");
    $("#womenSelect").prop("selectedIndex", 0);
    $("#otherSelect").prop("selectedIndex", 0);
    $("#electronicsSelect").prop("selectedIndex", 0);
    categoryId = $(this).val();
    document.getElementById("input").disabled = false;
    clothing = true;
  });
  $("#womenSelect").on("change", function () {
    $("#input").val("");
    $("#menSelect").prop("selectedIndex", 0);
    $("#otherSelect").prop("selectedIndex", 0);
    $("#electronicsSelect").prop("selectedIndex", 0);
    categoryId = $(this).val();
    document.getElementById("input").disabled = false;
    clothing = true;
  });
  $("#otherSelect").on("change", function () {
    $("#input").val("");
    $("#menSelect").prop("selectedIndex", 0);
    $("#womenSelect").prop("selectedIndex", 0);
    $("#electronicsSelect").prop("selectedIndex", 0);
    categoryId = $(this).val();
    clothing = true;
    document.getElementById("input").disabled = false;

  });
  $("#electronicsSelect").on("change", function () {
    $("#input").val("");
    $("#menSelect").prop("selectedIndex", 0);
    $("#womenSelect").prop("selectedIndex", 0);
    $("#otherSelect").prop("selectedIndex", 0);
    categoryId = $(this).val();
    clothing = false;
    document.getElementById("input").disabled = false;
  });

});