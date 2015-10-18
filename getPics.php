<?php
function curl($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 GTB5');
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

function getListOfTimesToLookUp($timestring)
{
    $timeArray = explode(":", $timestring);
    $hour = $timeArray[0];
    $minute = $timeArray[1];
    if (intval($hour) >= 12) {
        $hourIn12HrSystem = strval($hour - 12);
    } else {
        $hourIn12HrSystem = $hour;
    }
    if (strlen($hourIn12HrSystem) == 1) {
        $hourIn12HrSystem = "0" . $hourIn12HrSystem;
    }
    $time12HrSystem = $hourIn12HrSystem . ":" . $minute;
    if ($hour == $hourIn12HrSystem) {
        $timesToLookUp = array($time12HrSystem);
    } else {
        $time24HrSystem = $hour . ":" . $minute;
        $timesToLookUp = array($time12HrSystem, $time24HrSystem);
    }
    return $timesToLookUp;
}

function getRandomPicFromCategory($time) {
    $base = "https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&format=json&cmtype=file&cmtitle=Category:";
    $category = "Time_" . $time;
    $url = $base . $category;
    $res = json_decode(curl($url), true);
    $categorymembers = $res["query"]["categorymembers"];
    if (count($categorymembers) > 0) {
        $randomFile = $categorymembers[array_rand($categorymembers)];
        $pageid = $randomFile["pageid"];
        $title = str_replace(" ", "_", $randomFile["title"]);
        $creditUrl = "https://commons.wikimedia.org/wiki/" . $title;
        $thumbUrl = "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=640&titles=" . $title;
        $thumb = json_decode(curl($thumbUrl), true);
        $result = array($creditUrl, $thumb["query"]["pages"][$pageid]["imageinfo"][0]["thumburl"]);
        return json_encode($result);
    }
}

$time = $_POST["time"];

$timesToLookUp = getListOfTimesToLookUp($time);
$result = array();
foreach ($timesToLookUp as $time) {
    array_push($result, getRandomPicFromCategory($time));
}

echo $result[array_rand($result)];
