<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=441a78d42031a2a38e8c20c1c541f2cd" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=d020fd77b5f736a0e3fad2b3cea5dd8a" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=30f6833b09a42d664605903d0d9322cd" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=130733657cd2cd345288457e5ec7c2f4" charset="utf-8"></script><?php
} ?>