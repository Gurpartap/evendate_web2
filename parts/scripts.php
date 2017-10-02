<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=bee2a97abf470fff9b25dac04e8e7bce" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=f121dad750ed926fe105864a0c2deee3" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=cef5f2295a97581537032f12f56b96b2" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=a34d4a42bd84beb1f0a2726f6be433db" charset="utf-8"></script><?php
} ?>