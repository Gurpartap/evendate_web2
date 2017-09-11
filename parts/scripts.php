<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=cffd4b9c8e618ebda5cd53878b1275bc" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=ee55e12d77e6c5c84e060ebbeed886ee" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=e86dc65799c7075a7eeb37fd0eb068d9" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=b152dd30aeefe2cbb9ae68c184021f34" charset="utf-8"></script><?php
} ?>