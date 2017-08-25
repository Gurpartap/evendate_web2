<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=278202bb06c880c0430402db8ba94ab2" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=85fc78e74e5652300fad366fbb6438c0" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=fc4df8678f0354c872fbb6261aec6a47" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=2b1b1aaf7eb26472e60a8452e4e16241" charset="utf-8"></script><?php
} ?>