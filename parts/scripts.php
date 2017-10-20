<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=dac7fe93a28646095ef5e4218fea94b3" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=479e0b5796554ae15c25e0d3004a439c" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=fb975166368015997c29c8e348834a3d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=d35b5ef98c8f3fb3efc048fdf1e2b46c" charset="utf-8"></script><?php
} ?>