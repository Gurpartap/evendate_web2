<!-- Yandex.Metrika counter -->
<script src="https://mc.yandex.ru/metrika/watch.js" type="text/javascript"></script>
<script type="text/javascript">try {
		var yaCounter32442130 = new Ya.Metrika({
			id: 32442130,
			clickmap: true,
			trackLinks: true,
			accurateTrackBounce: true,
			webvisor: true,
			trackHash: true
		});
	} catch(e) {
	}</script>
<noscript>
	<div><img src="https://mc.yandex.ru/watch/32442130" style="position:absolute; left:-9999px;" alt=""/></div>
</noscript><!-- /Yandex.Metrika counter -->


<script>
	$(document).ready(function() {

		var _oauth_urls = JSON.parse('<?php

			require_once 'v1-backend/bin/db.php';
			require_once 'v1-backend/bin/Class.Result.php';

				echo json_encode(array(
					'mobile' => App::getAuthURLs('mobile')->getData(),
					'popup' => App::getAuthURLs('popup')->getData(),
				))
			?>');

		function openAuthLink(type) {
			if (isNotDesktop()) {
				window.location.href = _oauth_urls.mobile[type];
			} else {
				window.open(_oauth_urls.popup[type], type.toUpperCase() + '_AUTH_WINDOW',
					'status=1,toolbar=0,menubar=0&height=500,width=700');
			}
		}

		$('.vk-auth-btn').on('click', function(e) {
			yaCounter32442130.reachGoal('VkAuthStart');
			openAuthLink('vk');
			e.preventDefault();
		});

		$('.google-plus-btn').on('click', function(e) {
			yaCounter32442130.reachGoal('GoogleAuthStart');
			openAuthLink('google');
			e.preventDefault();
		});

		$('.facebook-btn').on('click', function(e) {
			yaCounter32442130.reachGoal('FacebookAuthStart');
			openAuthLink('facebook');
			e.preventDefault();
		});
	})
</script>