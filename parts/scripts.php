<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=a3a6ae4bcdea668423d22498eab6b95f" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=dcba7ebca31cad6fad2d7cd1bbee321d" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=c77f2a589507416bf9ad3120c1e4db32" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=0b62794b878a4c03953a92232df6cb03" charset="utf-8"></script><?php
} ?>