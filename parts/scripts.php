<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=f69bc538150dff48253000926d7c0f03" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=44ea20662eda17a8ad2dac361d247e31" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=cf627809083f4d15bf8c4cf77463e0f8" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=065640ea11a391326f2d8c9d494416f3" charset="utf-8"></script><?php
} ?>