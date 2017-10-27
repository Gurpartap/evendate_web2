<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=a33900e81e1e1d41238f3f0bcdfedc70" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=5043364b18b80ea1815ea6ae8a14b02e" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=42667f1baf3a2f4eb8c678802b83ad31" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=2e5eccb400269954636c8c78ff189aa4" charset="utf-8"></script><?php
} ?>