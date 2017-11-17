<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=7bb2de49dd45d402cd66893d7793c9ec" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=21fee76bbb6572c0aa9f91ae26598375" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=e3e9b1a4b3b607ccf64a01b394ddcd29" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=414050ec21de88497efde6c468b687b9" charset="utf-8"></script><?php
} ?>