<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=fd376b41f6ea54d9e065363230ed7906" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=8981371279be24aa3e20146b059dfdf7" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=24296dea8478d30155394b76330bdecc" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=9e2ba67b9323068c1f8ca65bdddcee07" charset="utf-8"></script><?php
} ?>