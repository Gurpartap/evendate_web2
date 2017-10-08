<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=422a5f9a975cbbb0e5ce9bedd67df6aa" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=f2695cf84ce587df1b6150cbd9c1ffdb" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=e4b35f93152ea5cf743d752ad0b0a069" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=bdce05a71980d3c3278f85de928372d5" charset="utf-8"></script><?php
} ?>