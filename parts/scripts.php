<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=b2e91ab5e4f8ba9a96fe06c12a3789fd" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=b83a49f13dc09edce7f8f8a39b9402f2" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=ed435a733dba8e2ac7b05382cd96747d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=30c38e7cb1ea1c5b0c2bbe1a6b58c76e" charset="utf-8"></script><?php
} ?>