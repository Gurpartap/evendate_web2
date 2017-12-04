<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=80e7939c1fae45851d7923354d15a197" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=f34046de4a1b461a976306d002804f25" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=1e49db5f0047f088bec8c05889dbcf87" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=e66d28ddb5c334feeeac81953d2cd06b" charset="utf-8"></script><?php
} ?>