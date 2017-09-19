<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=938c09c335116a5d12164f6829e7eecc" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=e0e7901ca4963835ccdd7657d4861660" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=0cefb49b41015258a7f4dd1ef277fbba" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=5a80803e6bd6f6aaa341709c24d18ab8" charset="utf-8"></script><?php
} ?>