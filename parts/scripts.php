<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=4de7476d2e01face4925b3139b5bf47b" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=30cacca80d731350bfde40e8cea5a0d0" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=6567746e61298181f9b74ebd7288d65d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=e2e8a02f9913bf938a6da52e551cd955" charset="utf-8"></script><?php
} ?>