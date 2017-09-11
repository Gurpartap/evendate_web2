<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=789c5a3e36603b7c893fafd01b929db0" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=6ea0411cb539d67a77e94a94b2c16a8e" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=e08dabf0ef3dcabc55cefaef347654c4" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=17b14d3f6b7633cc8ea1e29fe5776c93" charset="utf-8"></script><?php
} ?>