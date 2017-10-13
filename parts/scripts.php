<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=030b8ca9a32214d481eafd87e85f9da6" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=444b568d745520592b8f6fca6332e3c6" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=514cff0a2f689f01ae22c2c0deff0a23" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=ce303de64632195dde353de0752c37a0" charset="utf-8"></script><?php
} ?>