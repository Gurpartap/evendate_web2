<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=af531a6d0552b0a4d46125756eaafc12" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=7e8394731aea5d3ce736c6319bf35e0c" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=e6789a27131c1200384a8ed5701543de" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=54fd61fdc7e80759a51da11c99e9b7e7" charset="utf-8"></script><?php
} ?>