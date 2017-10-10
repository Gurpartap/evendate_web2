<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=d36be060f837d0af0d42e69df8ad50cd" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=4d60bfbb804ee0125ba9caa66309124c" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=fa2fc7715b818b996203340ed58901ef" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=ee2a09c4cfe642d24a3998162d9130f9" charset="utf-8"></script><?php
} ?>