<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=61069e3b221d1c9d1f2871864ee2ca4e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=99adccae3942a978aeedeffab39fe6f1" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=a9fc5936455490e8006adf655c079941" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=f5ce409dcb499774f8c1ce7e0e013e08" charset="utf-8"></script><?php
} ?>