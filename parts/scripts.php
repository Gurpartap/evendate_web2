<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=a33900e81e1e1d41238f3f0bcdfedc70" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=21333f57ec1f63ce772e6c697b787c18" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=e98326fb4584ef593a442ecddf02dbbf" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=ab595fd75cb2fbda3702801edeffc304" charset="utf-8"></script><?php
} ?>