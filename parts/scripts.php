<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=bd3784c3cbc437c3579677a31548d07c" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=f154a49ea1c6c60e4d45847e73e179be" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=8e4632274798856627f09de2fc250293" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=919a88f75bd46c92ca356257c7eba29a" charset="utf-8"></script><?php
} ?>