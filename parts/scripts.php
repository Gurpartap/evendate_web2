<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=07d2372e41bd735d448197de3d6bcf74" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=44eb41f648968799059ae512dc0cf66c" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=42b7978c2fdec1cb3c9f600beb3da885" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=4c371775545a3ac41a17ee831555142c" charset="utf-8"></script><?php
} ?>