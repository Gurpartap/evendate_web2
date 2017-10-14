<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=38bae93b6e4d7d7a323e52151988977f" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=3de12caaa12e7d559a1c86f760522541" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=c546ab4a413b906dbc0c5e923afab98d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=7953299a18dfae35f5b90cfa1a97b0a5" charset="utf-8"></script><?php
} ?>