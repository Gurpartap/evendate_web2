<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=ea32e6d4d0054b0d70b492921a93a3dc" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=28ea5d7679808f01dfa73fb52e751b06" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=bcef98a5d8e34d46659cfe776fce2ead" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=e84b4db582880f42b5cbf71773b5feb1" charset="utf-8"></script><?php
} ?>