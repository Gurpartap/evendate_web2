<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=4a134c7afce9fd8d533766b0fc27d39c" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=0b39b1f02b35e985b0d70072c306b02b" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=d10a992390985b3005927ec4e9b15610" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=85fc4a7c53ec230aed3b414af6534fd7" charset="utf-8"></script><?php
} ?>