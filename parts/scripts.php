<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=105315cfaaed08c5b35fad403f89507f" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=c70a6292f09c29eac1e6043e12c3baf5" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=54cb023dc64df9f9bb88dbf72c2c919e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=4e142ccae18dbf220b076828d02fe64a" charset="utf-8"></script><?php
} ?>