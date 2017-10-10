<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=f99750989dfc3688070c4c1c6ba4261b" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=ce077950a93bb70835d30ce4dcd25511" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=b427b61cae4cd1fc76105da332fbd761" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=1506deb5723ba76b9ba22db066e67341" charset="utf-8"></script><?php
} ?>