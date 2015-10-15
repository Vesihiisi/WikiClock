<?php
    function curl($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 GTB5');
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

    $time = $_POST["time"];

    $base = "https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&format=json&cmtype=file&cmtitle=Category:";
    $category = "Time_" . $time;
    $url = $base . $category;
    $res = json_decode(curl($url), true);
    $categorymembers = $res["query"]["categorymembers"];
    $randomFile = $categorymembers[array_rand($categorymembers)];
    $pageid = $randomFile["pageid"];
    $title = $randomFile["title"];
    $title = str_replace(" ", "_", $title);
    $creditUrl = "https://commons.wikimedia.org/wiki/" . $title;
    $thumbUrl = "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=640&titles=" . $title;
    $thumb = json_decode(curl($thumbUrl), true);
    $result = array($creditUrl, $thumb["query"]["pages"][$pageid]["imageinfo"][0]["thumburl"]);
    echo json_encode($result);


