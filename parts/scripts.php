<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=a3530b10f82a0853403697e850ae01fd" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=5f6872b9580893ba36bcc44aef12fb62" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=7dcfce46d560ca59ccf5d8a9d8695c11" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=aad6c6ef2906a9285f0dd05fc98ea627" charset="utf-8"></script><?php
} ?>