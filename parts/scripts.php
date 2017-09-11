<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=398215c0eab777bd7dd064aee856af66" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=a90fa1de2144345b4d6527258f554b3b" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=4609aee1ffa3799e72011507c2c562ef" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=a25daf544525a1708369210acadaf8e8" charset="utf-8"></script><?php
} ?>