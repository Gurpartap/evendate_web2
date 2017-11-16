<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=1129fcbcaf7416161819bfbfc9b31b82" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=e2105f7b336eee6fb779a080e977fc0c" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=87d84b46a2dabe470090723bdc730b65" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=1151d3df51412e595372d32f35e6c0c6" charset="utf-8"></script><?php
} ?>