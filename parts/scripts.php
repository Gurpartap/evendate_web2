<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=df7280a2cfe61340cb03b6d9ac7bce2d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=ba4e4d89682e101b38dba331bff147a1" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=fcde03016b591ab1c8dbcbd92f3cd72e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=8e78533b50f2f54e20e229a7e5d2b31f" charset="utf-8"></script><?php
} ?>