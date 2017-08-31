<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=b37d1d1cb2aeedee71471bc8db64f562" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=7b2ab1c9b2f55b6a5a26c34a50ed6b00" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=d2728f61df9950b2f244465bb0f9ee96" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=37f4244ec11097a23cc86765c7e3fa62" charset="utf-8"></script><?php
} ?>