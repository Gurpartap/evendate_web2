<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=954e5b4e4705dfb1eabd8306d7e79656" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=400b9f7d1100e613fad10e9c87524dff" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=6fb1dd7e2530f2857000f89432f7ddf9" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=369d050fe1650e3bf8fe038dd721cfcd" charset="utf-8"></script><?php
} ?>