<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=29c740edbd6f86134cb80f347ffea1f7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=fb23504a3620c24ba8ffb85220e13398" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=8ae7f427590fbbceb43fd942a922a570" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=309bd9cf046b53d0d210e73add6b019b" charset="utf-8"></script><?php
} ?>