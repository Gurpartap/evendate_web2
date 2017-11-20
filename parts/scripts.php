<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=6ebd93d2d4ea100ac7ecd8b30b0ef4bf" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=418f3b439a2acb4aa39c0674fd52582f" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=3f0ddd12f10807460fa60b10279ce0ad" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=2d1f055577134e42ee4e92e3729acf82" charset="utf-8"></script><?php
} ?>