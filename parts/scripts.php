<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=fc61b83f25c78c7e8cc34511ffae21ac" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=169dc4de7dadcd5c572c8f61001dc618" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=4854e6434792743d0a2e17b53f36cfe0" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=0feeef22944371d320dbec8d3fa3b9ad" charset="utf-8"></script><?php
} ?>