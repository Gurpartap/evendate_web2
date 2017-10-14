<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=a33900e81e1e1d41238f3f0bcdfedc70" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=382d5fb7584cf9a288104860e9410e7f" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=dc0d42f311573573fe36b6b1a61c9fa0" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=bb23c81907c06a5c60ca1ae7d649dd24" charset="utf-8"></script><?php
} ?>