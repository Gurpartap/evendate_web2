<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=2a3da9f96fb82a90a2bf9592246f91ca" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=0b2c7a2204889ec0cc6da4f0c0fb3bf9" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=90d74c19eadf72930632e6d165529b3b" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=f556db1c4ee0a540cd08561a605c8ab3" charset="utf-8"></script><?php
} ?>