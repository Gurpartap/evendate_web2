<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=dd23af70ca2e9e2d79e27c5ace7a6c21" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=bec3e0094ce931f080ac736ce408df49" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=fdfc77d5413cd09de57a27652f0ce55c" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=08430d8db31df0f0d2112db6bc19f043" charset="utf-8"></script><?php
} ?>