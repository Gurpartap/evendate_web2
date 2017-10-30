<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=2d9813be53bda85e871b2b8fb94ec9b3" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=7eb85b705fc9c25437cd83e58175cc83" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=542a0b0079881768a024a6fb7de305e0" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=ed809caf7112dd9c8810f032274cf848" charset="utf-8"></script><?php
} ?>