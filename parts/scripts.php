<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=07d2372e41bd735d448197de3d6bcf74" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=f122482724f3440e1daacd55b9a620cc" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=42b7978c2fdec1cb3c9f600beb3da885" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=2501d30a95e4502297f3998045d9144c" charset="utf-8"></script><?php
} ?>