<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=be0f8cf63e8d829f8016567a9045cac7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=ea68473123876812881489b4fffd0e26" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=b6bdc9a901668c58d12be0dd63ad4bcd" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=993175c21bf0f565cfa010007a169adf" charset="utf-8"></script><?php
} ?>