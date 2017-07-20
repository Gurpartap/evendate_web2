<?php

$type = $_GET['type'];

$main_part = file_get_contents("./main_part.html");
$header_part = file_get_contents("./{$type}/header.html");
$body_part = file_get_contents("./{$type}/body.html");

$main_part = str_replace('{header_part}', $header_part, $main_part);
$main_part = str_replace('{body_part}', $body_part, $main_part);

echo $main_part;