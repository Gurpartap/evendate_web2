<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=06ff4d1f53b40439fc3379802470c586" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=da3adb72638b07fea89c0063ecb29c32" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=1d4b9bec2b671988897c51c1af13f079" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=b409a1c946cf1e1a54e247e9198e0402" charset="utf-8"></script><?php
} ?>