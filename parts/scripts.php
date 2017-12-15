<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=0a58f927df9c0c9f9ed2db99c43c6113" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=a8fd8c30aa9db8a2159255237a11d732" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=d06b9b85cf889ad5899a32b13b1e3545" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=668f7097416013da9efd46eb32ae4d3a" charset="utf-8"></script><?php
} ?>