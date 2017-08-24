<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=ce329e452da318ccf5010f6a48949e03" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=b3e3e6da30f2700c242cfa7cab201a3a" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=7c41b0cde76839bc57caef45734b5396" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=55a97862dd911ff115579357fafe5512" charset="utf-8"></script><?php
} ?>