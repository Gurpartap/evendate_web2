<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=1d87e563e8a41333fc5596b3c54a78a1" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=dcf5dbd0468d7092ac3809b49777e857" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=283b8e9b26c9c9af136817d2a7e5fe45" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=5501d2f0cabbd3d1c4f7d431fcafcc7c" charset="utf-8"></script><?php
} ?>