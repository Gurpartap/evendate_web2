<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=8b987692598bb17632e47eaad80ded68" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=72f50ba97a6c02c6de9294de1348214a" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=dc0d42f311573573fe36b6b1a61c9fa0" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=bb23c81907c06a5c60ca1ae7d649dd24" charset="utf-8"></script><?php
} ?>