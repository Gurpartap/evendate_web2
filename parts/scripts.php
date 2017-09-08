<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=26372355e6d70a7b86a498bed85d4725" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=ccfb5824b9401d752b86851cd69df906" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=5a4cdb02ab5973e48883a68ad97503b0" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=9f50292b902fb8b4c02461fa811306f4" charset="utf-8"></script><?php
} ?>