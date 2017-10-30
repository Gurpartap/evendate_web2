<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=3280819bdd462635ef5c41d387add43a" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=b54aa208d72e15569f04edb42ffd9bd1" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=01e8d1464d3a9be6e79e78f696fc98d7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=912e32df8f84d1bcb0ea1e7bb333c244" charset="utf-8"></script><?php
} ?>