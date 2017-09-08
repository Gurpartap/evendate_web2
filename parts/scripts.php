<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=06d3abe2b3b633032e1044af27e28423" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=db3da98a21cb9dc43344e8dd3787d7ef" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=a52b019b8f7c62934ed2581742e5e2b5" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=70c2238f6ee596dcb54430c75718b5f0" charset="utf-8"></script><?php
} ?>