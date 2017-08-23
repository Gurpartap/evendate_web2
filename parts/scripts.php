<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=4d34f0949d2d2afc2a45f28d011d0ab4" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=7397e26bb037125badf601de55ecc19f" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=3f1aadb98b24b662600eefd69a9a0908" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=0b7db24057de83dec194e97f6d64aa9c" charset="utf-8"></script><?php
} ?>