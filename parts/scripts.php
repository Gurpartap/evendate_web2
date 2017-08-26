<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=26372355e6d70a7b86a498bed85d4725" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=4f61a2918c420a7b986bf234019e3d62" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=16c921f08253f71e2aa9faa8afa3803c" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=b9805a175ecf50f12da98bd5ddc1a101" charset="utf-8"></script><?php
} ?>