<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=0a37ff85bc6b9d20223359287514ed21" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=3724221f1d32427273e01132d0be3b56" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=7d8dc873f0c2e99cb823236185250ac3" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=c1aad47c7607a03d7c1e24ae18422498" charset="utf-8"></script><?php
} ?>