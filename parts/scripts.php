<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=024169d0167626062151f7fd4327a432" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=fe1d0023a3018d82cc8a2a00e317f95d" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=63d3c531124a9ddec1fe6f86fea5f707" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=aa09257627ca11e732b92b978df28366" charset="utf-8"></script><?php
} ?>