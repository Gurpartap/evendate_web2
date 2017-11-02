<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=042bc8829a7f0911ce8b2bb0887713dc" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=d1038c46b895353a23c53bff76495d81" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=6d06bdeeb7a8f7395009b2739fd1074b" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=22489ec26e1c349a4a7a5c0d2e4e13f8" charset="utf-8"></script><?php
} ?>