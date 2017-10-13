<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=f68fa270b1a3d68a678cd82994e3d72a" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=4056acbcfde86b495d2dcf639c851064" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=3b0d22d4523bf19e12eb4061f5fb0516" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=d76ca8e664aa3bddfbf3156659607790" charset="utf-8"></script><?php
} ?>