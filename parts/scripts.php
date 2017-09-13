<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=7423ffce19b5acf0c502ae880cd5449d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=b2d8ebd8d2e6ee46bd9a5aa926e8e3dc" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=9d48e6ea50098e97868f5abcff106c20" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=dda36abc425a5e2bccf99edd6a6db314" charset="utf-8"></script><?php
} ?>