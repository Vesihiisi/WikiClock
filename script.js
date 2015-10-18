$(document).ready(function() {
    "use strict";
    console.log("ready!");
    var savedMinute = null;
    var prefetchedPicture = null;
    var clock = $("#clock");
    var pictureContainer = $(".picture-container");

    function createImg(src, title) {
        var img = $('<img />', {
            id: 'picture',
            src: src,
            alt: title,
            title: title,
            class: "img-responsive photo"
        });
        return img;
    }

    function wrapImgInLink(picture, url) {
        picture.wrap('<a href="' + url + '" target ="_blank"/>');
    }


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



    function displayPicture(arrayWithTwoUrls) {
        var linkToFullImg = arrayWithTwoUrls[0];
        var thumbnail = arrayWithTwoUrls[1];
        var oldPicture = pictureContainer.html();
        var newPicture = createImg(thumbnail, getTime("noSeconds"));
        pictureContainer.html(newPicture);
        wrapImgInLink(newPicture, linkToFullImg);
    }

    function getTime(option) {
        var currentTime = new Date();
        var currentHours = currentTime.getHours();
        var currentMinutes = currentTime.getMinutes();
        currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
        var currentSeconds = currentTime.getSeconds();
        currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
        if (option == "withSeconds") {
            return currentHours + ":" + currentMinutes + ":" + currentSeconds;
        } else if (option == "noSeconds") {
            return currentHours + ":" + currentMinutes;
        }

    }

    function updateClock() {
        var timeString = getTime("withSeconds");
        clock.html(timeString);
        var timeArray = timeString.split(":");
        var currentHours = timeArray[0];
        var currentMinutes = timeArray[1];
        if (currentMinutes != savedMinute) {
            savedMinute = currentMinutes;
            var timeToLookUp = currentHours + ":" + savedMinute;
            fetchPicture(timeToLookUp);
        }

    }

    if (clock.length) {
        updateClock();
        setInterval(updateClock, 1000);
    }

});
