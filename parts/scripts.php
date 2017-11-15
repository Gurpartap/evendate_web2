<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=4cdd453503f88d877e0e9c905c72008a" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=f41f42af89b808f4e20ac283c71a6fc2" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=d3a5a76553970a7255c7cdf7d1563cbb" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=dc7317c2c7c7da39d2202df76b55a5ac" charset="utf-8"></script><?php
} ?>