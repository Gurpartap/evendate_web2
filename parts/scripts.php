<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=dd7fbedd51bbce30b88460b14f5ae2fa" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=d67b41a8607ed8c14221e489389421c6" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=eea1416e59c266cbbc6c506db6e402c7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=95c54cce6a8ef525a4c3d3d01b799a5c" charset="utf-8"></script><?php
} ?>