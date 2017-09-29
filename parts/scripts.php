<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=7a2de6f6dc6d02d86a9b4a0bf3361eab" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=790589f8dd12cfe8d45162ebd3239c37" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=2fb67cb0655d8cd8140f9504180e934d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=ceb830bb8d1d34129878e02dc529d304" charset="utf-8"></script><?php
} ?>