<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=41a1b671f72b1512c2948e29009b4a02" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=e8e8c5f32ae4035c9c8c0f8286d5720d" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=77641beaa6422f06e2613b0129657a67" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=e39634497aac5e6d435c2bbf9e5d96b4" charset="utf-8"></script><?php
} ?>