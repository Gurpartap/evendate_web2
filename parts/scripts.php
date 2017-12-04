<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=168da4ace1b7b3c9a514a945b9bf17e7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=42259cbf1aeac877bb4debbccb69015c" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=521645fcd196c0aa5c3e6781a76eea11" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=a2aef44adcbb977b542310ea9c2d0a74" charset="utf-8"></script><?php
} ?>