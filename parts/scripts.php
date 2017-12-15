<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=ac68ba0ae5b891857a7a328540fdc010" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=73911c3f8cdc4e0269b89ac0d839f35f" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=33db96a15255be38d809e6e6c7a6d1bf" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=2133d929bf16558035548e5a7a4f17ae" charset="utf-8"></script><?php
} ?>