<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=2128560be10ce030473c4e42c55db6f8" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=c408da6851d5d9b922adc46d66807a62" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=648799f91e0d1dcd6ff963b9ae870ab4" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=afd3e3b359e937ea91b0870cfe0ddfe4" charset="utf-8"></script><?php
} ?>