<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=29853b9e3e239953d668b716b818dece" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=7d6b7506359a57874b5af7ee5b2bc7e1" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=bad76bcefad54375b9bd5dbe8516fcc7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=f92e19ba4c1c2cd83bd22b4e7506399c" charset="utf-8"></script><?php
} ?>