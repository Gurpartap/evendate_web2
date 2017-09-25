<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=209f75a9f98b9959b3517d2c4a8b0c89" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=580da5f222e9ebbc441ecaa6ee77c5b1" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=c9140a2c6ec1a32564802741ab42d479" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=07137864c7f657444507d5326f6ec413" charset="utf-8"></script><?php
} ?>