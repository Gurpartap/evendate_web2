<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=5037fce5d077bfe9b82de97459e2c3ea" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=35692d919b96b6625bfe9f88777bfa6b" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=cef5f2295a97581537032f12f56b96b2" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=a34d4a42bd84beb1f0a2726f6be433db" charset="utf-8"></script><?php
} ?>