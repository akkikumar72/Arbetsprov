$(document).ready(function() {
    //init values
    var localeAPI = "https://api.myjson.com/bins/148rdn",
        $terms = "";
    ($return = []), ($search = "");
    $('.search-result').css('visibility', 'hidden');
    //calling single time only
    callCountryList();

    function callCountryList() {
        //Calling public Api
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                ($terms = readBody(xhr).split('"').sort()), ($return = []);
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
            if (strArray[j].toLowerCase().match(str.toLowerCase()) && $return.length < 5) {
                var $h = strArray[j].replace(str, "<strong>" + str + "</strong>");
                $return.push('<li class="prediction-item"><span class="prediction-text">' + $h + "</span></li>");
            }
        }
    }

    function nextItem(kp) {
        if ($('.focus').length > 0) {
            var $next = $('.focus').next(),
                $prev = $('.focus').prev();
        }
        if (kp == 38) { // Up
            if ($('.focus').is(':first-child')) {
                $prev = $('.prediction-item:last-child');
            }
            $('.prediction-item').removeClass('focus');
            $prev !== undefined ? $prev.addClass('focus') : '';
        } else if (kp == 40) { // Down
            if ($('.focus').is(':last-child')) {
                $next = $('.prediction-item:first-child');
            }
            $('.prediction-item').removeClass('focus');
            $next !== undefined ? $next.addClass('focus') : '';
        }
    }

    function getFormattedDate(currentdate) {
        var datetime = currentdate.getDate() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        return datetime;
    }
    $(function() {
        $('#search-bar').keydown(function(e) {
            $key = e.keyCode;
            if ($key == 38 || $key == 40) {
                nextItem($key);
                return;
            }
            setTimeout(function() {
                var $search = $('#search-bar').val();
                $return = [];
                strInArray($search, $terms);
                $('#search-bar').css('border-radius','5px 5px 0 0px');
                if ($search == '' || !$('input').val) {
                    $('.output').html('').slideUp();
                    $('#search-bar').css('border-radius','5px');
                } else {
                    $('.output').html($return).slideDown();
                }
                $('.prediction-item').on('click', function() {
                    $text = $(this).find('span').text();
                    $("#search-bar").val($text);
                    $('.output').slideUp(function() {
                        $(this).html('');
                    });
                    $('.search-result').css('visibility', 'visible');
                    $("input").blur();
                    $("input").focus();
                    $('#search-bar').css('border-radius','5px');
                    $("#search-list-result").append('<li><span class="tab">' + $('#search-bar').val() + "</span><span>" + getFormattedDate(new Date()) + '<a class="close-wrapper" href="javascript:void(0)" onclick="$(this).parent().parent().remove()"><img src="https://s17.postimg.org/z57yc6kvz/error_White.png" alt="cross"></a></span></li>');
                });
                $('.prediction-item:first-child').addClass('focus');
            }, 50);
        });
        $('#search-bar').focus(function() {
            if ($('.prediction-item').length > 0 && $("#search-bar").val() !== "") {
                $('.output').slideDown();
            }
        });
        $('#searchform').submit(function(e) {
            e.preventDefault();
            $text = $('.focus').find('span').text();
            $(".output").slideUp();
            if ($("input").val() !== "") {
                setTimeout(function() {
                    if ($('.prediction-item').length > 0) {
                        $('.search-result').css('visibility', 'visible');
                        $("#search-list-result").append('<li><span class="tab">' + $("#search-bar").val() + "</span><span>" + getFormattedDate(new Date()) + '<a class="close-wrapper" href="javascript:void(0)" onclick="$(this).parent().parent().remove()">' + '<img src="https://s17.postimg.org/z57yc6kvz/error_White.png" alt="cross"></a></span></li>');
                    }
                }, 5);
            }
            $("#search-bar").val($text);
            $("input").blur();
            $("input").focus();
        });
        $('#search-bar').blur(function() {
            setTimeout(function() {
                $("#search-bar").val('');
                if ($('.prediction-item').length > 0 && $("#search-bar").val() !== "") {
                    $('.output').slideUp('fast');
                }
            }, 10)
        });
    });
});
