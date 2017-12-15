<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=7eb6137a3e82cec6deec6a3a7500fa2e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=ad16fd592885904ce83e7d9b3c242292" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=6d70218516eb6fae46bdcea7f001ba8c" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=914defe81cbd1979c9b4a0216166e85e" charset="utf-8"></script><?php
} ?>