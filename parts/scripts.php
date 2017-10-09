<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=a7e84dc05a2337ac5b2f75ea9f100ce2" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=f215f8fee4f0dfaf9d78b540100e49f8" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=ff08639566c78ece5d3c4779542986b7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=bf54840b1a66a210363837197f2c0b7e" charset="utf-8"></script><?php
} ?>