<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=c6663740d1741412a8e34549ab0a919a" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=38abfed8af1896c402708a636c5a9673" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=8741be36cfdfc047f9b13aa70ac15608" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=f7df98e92a4472e73fd46a17fc66e516" charset="utf-8"></script><?php
} ?>