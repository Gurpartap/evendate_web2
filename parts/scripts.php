<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=d7b43550b5ec4a5b06203e28261d64b7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=98a679e1429820ed58534688f9ab63f3" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=3156aef6c1075dd106226efb47118738" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=c2f423ae43a32b49ded1df99196a2d32" charset="utf-8"></script><?php
} ?>