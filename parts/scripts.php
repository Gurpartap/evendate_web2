<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=53cddc88356a69d346ce684582984b5b" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=7bf226f45fce8949a6e65f404077a915" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=f52593115ce01d5d5c09637d7d24ca64" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=f48a6c909c0e2ca3d1bb2d431d19de08" charset="utf-8"></script><?php
} ?>