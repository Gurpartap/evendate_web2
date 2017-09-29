<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=8b3ae8299b72fb0877c7e638bb34b7e0" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=c7e7c6f853224553e57e72c17e024341" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=af32bc6c339a340b99ee9b5e141b9bca" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=af273935d526ab539e6a03b4a291c467" charset="utf-8"></script><?php
} ?>