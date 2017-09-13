<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=7a9517253112f8c5b3b90adb2c44a978" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=9f821fc4400ca52a86efe15463e0c119" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=997119e5295e6e7b36f0edfa9d85697e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=84457044d55c99ac6a1f4c9a1b814ab5" charset="utf-8"></script><?php
} ?>