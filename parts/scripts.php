<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=6034290778c4188256862669740edd20" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=9fc3e6a1f45289423b3f10069cd14110" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=54894cbedb3286d66b5e576d5eba4bb4" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=30fceff9e505321d2258444f280f1bd0" charset="utf-8"></script><?php
} ?>