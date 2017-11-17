<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=f4f6efb4b6507fd4ee5c47120b69ecd9" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=b9c02202abd8f85418be5d2924d6f9c9" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=edcb8d02f85ee0e7ee760de58ffd8a4f" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=6d58e4e5962906788beb150f7f9b550d" charset="utf-8"></script><?php
} ?>