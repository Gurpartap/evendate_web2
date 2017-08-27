<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=cffd4b9c8e618ebda5cd53878b1275bc" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=45e5eca3ab27c51c28b0ff90c750da4f" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=63d3c531124a9ddec1fe6f86fea5f707" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=e51ceeb6f3af35898455e42d6e3c3686" charset="utf-8"></script><?php
} ?>