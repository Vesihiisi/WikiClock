$(document).ready(function() {
    "use strict";
    console.log("ready!");
    var savedMinute = null;
    var prefetchedPicture = null;
    var clock = $("#clock");
    var picture = $("#picture");


    function fetchPicture(time) {
        if (prefetchedPicture !== null) {
            displayPicture(prefetchedPicture);
        }
        $.post("getPics.php", {
                time: time,
            })
            .done(function(data) {
                data = $.parseJSON(data);
                if (prefetchedPicture === null) {
                    displayPicture(data);
                }
                $.post("getPics.php", {
                        time: calculateNextMinute(time),
                    })
                    .done(function(data) {
                        data = $.parseJSON(data);
                        saveThisAsPrefetchedPicture(data);
                    });
            });
    }

    function saveThisAsPrefetchedPicture(data) {
        prefetchedPicture = data;
    }


    function calculateNextMinute(time) {
        var splitted = time.split(":");
        var hour = parseInt(splitted[0]);
        var minute = parseInt(splitted[1]);
        var newHour = null;
        var newMinute = null;
        if (minute < 59) {
            newHour = hour.toString();
            newMinute = (minute + 1).toString();
            if (newMinute.length == 1) {
                newMinute = "0" + newMinute;
            }
        } else if (minute == 59) {
            newMinute = "00";
            newHour = (hour + 1);
            if (newHour > 12) {
                newHour = newHour - 12;
            }
            newHour = newHour.toString();
        }
        if (newHour.length == 1) {
            newHour = "0" + newHour;
        }
        return newHour + ":" + newMinute;
    }

    function clearPicture(element) {
        element.html("");
        element.off();
    }

    function addClickHandler(element, url) {
        element.click(function() {
            window.open(url);
            return false;
        });
    }

    function displayPicture(arrayWithTwoUrls) {
        var linkToFullImg = arrayWithTwoUrls[0];
        var thumbnail = arrayWithTwoUrls[1];
        clearPicture(picture);
        picture.attr("src", thumbnail);
        $("#link").attr("href", linkToFullImg);
        addClickHandler(picture, linkToFullImg);
        if (picture.hasClass("photo")) {} else {
            picture.addClass("photo");
        }
    }

    function updateClock() {
        var currentTime = new Date();
        var currentHours = currentTime.getHours();
        var currentMinutes = currentTime.getMinutes();
        var currentSeconds = currentTime.getSeconds();
        currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
        currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
        var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds;
        clock.html(currentTimeString);
        if (currentMinutes != savedMinute) {
            savedMinute = currentMinutes;
            currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;
            currentHours = (currentHours < 10 ? "0" : "") + currentHours;
            var timeToLookUp = currentHours + ":" + savedMinute;
            fetchPicture(timeToLookUp);
        }

    }

    updateClock();
    setInterval(updateClock, 1000);

});
