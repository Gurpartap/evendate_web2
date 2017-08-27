<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=b1552a2a08ff05c2e8160530da7e941b" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=9eabdf79fe22fca23ad0ff6c46525fdd" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=4f930a210b63041ce62acac23fda1034" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=4b4e758c46ec17b80d55fcf7fa2b9e2c" charset="utf-8"></script><?php
} ?>