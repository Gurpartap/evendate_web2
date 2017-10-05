<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=bee2a97abf470fff9b25dac04e8e7bce" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=6c5e069b4f3951ab69b1b70782a0585b" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=81628efe12690f90875f5a98df8a095f" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=3b2c5b4b42fd5872dc89a0125847c745" charset="utf-8"></script><?php
} ?>