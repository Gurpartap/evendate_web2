<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=23e2af2e9977a382d0c8d69c22851446" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=a4d91ea8cdce5d36fc3b4dd2fd5f9ba3" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=a2ed5d2193b901eb930cf2f21e635768" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=a54f96a2fbac84db3d20d16c0fee366f" charset="utf-8"></script><?php
} ?>