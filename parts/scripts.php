<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=644692e9faaded4e159133c48b38df2f" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=e245ed1299c9cb2276e69cfcacaf7bad" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=75db6547d6712af17b299cd6b0f0fe63" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=e7d768000932da8a754a5351db2b8dc6" charset="utf-8"></script><?php
} ?>