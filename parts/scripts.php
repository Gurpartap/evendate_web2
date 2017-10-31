<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=3e67a7e872882927bf446c64cbcef941" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=69db23612a9852c378b23eca2877573e" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=f9c40b246e618601ed32ae69252b6d26" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=d9ec872e1c2172943bb0992bdba59a1a" charset="utf-8"></script><?php
} ?>