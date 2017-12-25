<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=f49e1649e8ba5b7c9d5236dde6ceccd5" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=7056394ee01cc26a0b973397cdcc2f3c" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=7f2c44f9b1f6dc784b81f315a6266034" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=6e9d34519a8a01e9fd6cc1d914fdd497" charset="utf-8"></script><?php
} ?>