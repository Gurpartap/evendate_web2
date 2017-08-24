<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=001417e40c91373add200e40150eab85" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=4f633a3473c23cec497006842d96fcad" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=51bddeef87fb9dc89bbbfb7e333f579c" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=eb48273613e9cb551f5be2a8b225469b" charset="utf-8"></script><?php
} ?>