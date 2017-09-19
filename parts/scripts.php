<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=795c61346cf370588ac4b9eec33fb499" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=7adcc6176698b7a6c799b8bf590ba8f7" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=3a1f7de76b8b5cade1beea4658fa8bcf" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=1e1b5b0727ec47a8943c411ea7178e4d" charset="utf-8"></script><?php
} ?>