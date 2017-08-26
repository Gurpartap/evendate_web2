<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=cad79614eb0945cb2a91777b3ffc8027" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=3ff661bf4f9d674afdaa7ce9c65c4106" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=120ead9620fc19ae10f296111c60ffd8" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=88fde59b379e36322c888bcf28b9c9f2" charset="utf-8"></script><?php
} ?>