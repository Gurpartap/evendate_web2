<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=81937e456a6da66c28144a40d6af5c77" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=96373bfa699741675157a8a3659d3ff9" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=cfc4665a0e7275dea476d693c4d2475e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=c6826963e14875f41c4f792a0831694e" charset="utf-8"></script><?php
} ?>