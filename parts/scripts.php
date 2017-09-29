<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=4530bf7ade952d391f51a0f6f2b91a8d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=fe27ed7f74a49d19ffb3ce4231dfea44" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=802866f89522406dfb3d5a059c2e0ecb" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=c79f5fdd62744aba7025ec6977b10135" charset="utf-8"></script><?php
} ?>