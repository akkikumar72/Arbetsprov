$(document).ready(function() {
  //init values
  var localeAPI = "https://api.myjson.com/bins/148rdn",
    $terms = "";
  ($return = []), ($search = "");
  document.getElementsByClassName("search-result")[0].style.visibility =
    "hidden";
  //calling single time only
  callCountryList();

  function callCountryList() {
    //Calling public Api
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        ($terms = readBody(xhr)
          .split('"')
          .sort()),
          ($return = []);
      }
    };
    xhr.open("GET", localeAPI, true);
    xhr.send(null);
  }

  function readBody(xhr) {
    var data;
    if (!xhr.responseType || xhr.responseType === "text") {
      data = xhr.responseText;
    } else if (xhr.responseType === "document") {
      data = xhr.responseXML;
    } else {
      data = xhr.response;
    }
    return data;
  }

  function strInArray(str, strArray) {
    for (var j = 0; j < strArray.length; j++) {
      if (
        strArray[j].toLowerCase().match(str.toLowerCase()) &&
        $return.length < 6
      ) {
        var $h = strArray[j].replace(str, "<strong>" + str + "</strong>");
        $return.push(
          '<li class="prediction-item"><span class="prediction-text">' +
            $h +
            "</span></li>"
        );
      }
    }
  }

  function nextItem(kp) {
    if (document.getElementsByClassName("focus") !== []) {
      var $next = $(".focus").next(),
        $prev = $(".focus").prev();
    }
    if (kp == 38) {
      // Up
      if (document.querySelector(".focus") === ":last-child") {
        $prev = document.querySelector(".prediction-item:last-child");
      }
      document.querySelector(".prediction-item").removeClass("focus");
      $prev.addClass("focus");
    } else if (kp == 40) {
      // Down
      if ($(".focus").is(":last-child")) {
        $next = $(".prediction-item:first-child");
      }
      $(".prediction-item").removeClass("focus");
      $next.addClass("focus");
    }
  }

  $(function() {
    document
      .getElementById("search-bar")
      .addEventListener("keydown", searchBarKeyDown);
    function searchBarKeyDown(e) {
      $key = e.keyCode;
      if ($key == 38 || $key == 40) {
        nextItem($key);
        return;
      }
      setTimeout(function() {
        var $search = $("#search-bar").val();
        $return = [];
        strInArray($search, $terms);
        if ($search == "" || !$("input").val) {
          $(".output")
            .html("")
            .slideUp();
        } else {
          $(".output")
            .html($return)
            .slideDown();
        }
        $(".prediction-item").on("click", function() {
          $text = $(this)
            .find("span")
            .text();
          $(".output").slideUp(function() {
            $(this).html("");
          });
          $("#search-bar").val($text);
          document.getElementsByClassName("search-result")[0].style.visibility =
            "visible";
          $("#search-list-result").append(
            '<li><span class="tab">' +
              $search +
              "</span><span>" +
              getFormattedDate(new Date()) +
              '<a class="close-wrapper" href="#" onclick="$(this).parent().parent().remove()"><img src="https://s17.postimg.org/z57yc6kvz/error_White.png" alt="cross"></a></span></li>'
          );
        });
        $(".prediction-item:first-child").addClass("focus");
      }, 50);
    }

    document.getElementById("search-bar").addEventListener("focus", function() {
      if (document.getElementsByClassName("prediction-item").length > 0) {
        $(".output").slideUp();
      }
    });
    document
      .getElementById("searchform")
      .addEventListener("submit", function(e) {
        e.preventDefault();
        $text = $(".focus")
          .find("span")
          .text();
        $(".output").slideUp();
        if ($("input").val() !== "") {
          document.getElementsByClassName("search-result")[0].style.visibility =
            "visible";
          setTimeout(function() {
            $("#search-list-result").append(
              '<li><span class="tab">' +
                $("#search-bar").val() +
                "</span><span>" +
                getFormattedDate(new Date()) +
                '<a class="close-wrapper" href="#" onclick="$(this).parent().parent().remove()"><img src="https://s17.postimg.org/z57yc6kvz/error_White.png" alt="cross"></a></span></li>'
            );
          }, 50);
        }
        $("#search-bar").val($text);
        $("input").blur();
      });

    document.getElementById("search-bar").addEventListener("blur", function() {
      if (document.getElementsByClassName("prediction-item").length > 0) {
        $(".output").slideUp();
      }
    });

    function getFormattedDate(currentdate) {
      var datetime =
        currentdate.getDate() +
        "-" +
        (currentdate.getMonth() + 1) +
        "-" +
        currentdate.getFullYear() +
        "  " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      return datetime;
    }
  });
});
