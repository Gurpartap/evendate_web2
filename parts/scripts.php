<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=86e45e97ec0a5eef8925d9423386d0f8" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=b31c7ff81ce6a9d66c620a05f7b75df4" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=9d9663851fafc5d1d32c8d7969c08ab3" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=079f1fdf0a1465c4a9fdfcb90040a297" charset="utf-8"></script><?php
} ?>