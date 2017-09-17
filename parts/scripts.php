<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=034c0cfa8f3416bf5f6a5b7540e0e6e1" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=a7c75e25f81ba176d7daca049c1e7215" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=c96550e37f5d61b1251619b1afc285f4" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=9c7323a692f158c3c374bf2a993a8918" charset="utf-8"></script><?php
} ?>