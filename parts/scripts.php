<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=69fb751485dfd4478b65b0b8092b0791" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=52b4f4545dd5c0ef575966ccdb85506e" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=b405c34739889d82449fcca55d04e82d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=7d5fab387d2f577701c2ae7478b3de04" charset="utf-8"></script><?php
} ?>