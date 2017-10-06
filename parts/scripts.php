<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=4ce7f8b155b6573a75838deeb4fb8602" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=64a1e841afd0113b63e8dd1a0934b8d5" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=eff122f831c520f3783b2dcf0b9877aa" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=1ee98abe4796ac5ab027b1f5aa3cf804" charset="utf-8"></script><?php
} ?>