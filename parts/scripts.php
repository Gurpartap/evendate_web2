<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=2b6e1d8327c6d8cb1dfd3817b1940b95" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=6475d61be9ddc762b6f331f671edf132" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=0e26a4894ba5dbf59824030c5c2da55c" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=7bf008a98cfc36d2e8b2945592b7cfaa" charset="utf-8"></script><?php
} ?>