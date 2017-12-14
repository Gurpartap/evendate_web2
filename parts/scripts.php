<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=36937a642c14c6cfeb55bf1c94a4c574" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=ba2daac64229fed00554c5f7b3f405e9" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=3bb4406c626eb1c9cc9f8c370b5d21cf" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=126f37cfd8a0030b98577b62ea97141f" charset="utf-8"></script><?php
} ?>