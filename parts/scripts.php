<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=89ac0b93bfb19b00388b67d59b835a2b" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=035b35ff637c59d282432bf93ebf6d6a" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=bd11a9dd4ff3b66676317b7763d8f5da" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=c2ea3efa920582ab969d9389ed52a615" charset="utf-8"></script><?php
} ?>