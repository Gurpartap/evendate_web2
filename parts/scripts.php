<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=e511637965bb9dda2c39663c9537031d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=89d5faa29a29bd98904504f02a44d2bc" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=d29b99c58cec0516f399f553e9797290" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=5ea7afdf891730fda2887b42bcc4f615" charset="utf-8"></script><?php
} ?>