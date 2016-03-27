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


<script src="vendor/vk_openapi/openapi.js" type="text/javascript"></script>

<script>
	$(document).ready(function() {

		VK.init({
			apiId: <?=App::$SETTINGS->VK->APP_ID?>
		});

		var _oauth_urls = {
			mobile: {
				vk: 'https://oauth.vk.com/authorize?client_id=<?=App::$SETTINGS->VK->APP_ID?>&scope=groups,friends,email,wall,offline,pages,photos,groups&redirect_uri=http://<?=App::$DOMAIN?>/vkOauthDone.php?mobile=true&response_type=code',
				google: 'https://accounts.google.com/o/oauth2/auth?scope=email profile https://www.googleapis.com/auth/plus.login &redirect_uri=http://<?=App::$DOMAIN?>/googleOauthDone.php?mobile=true&response_type=token&client_id=403640417782-lfkpm73j5gqqnq4d3d97vkgfjcoebucv.apps.googleusercontent.com',
				facebook: 'https://www.facebook.com/dialog/oauth?client_id=1692270867652630&response_type=code&scope=public_profile,email,user_friends&display=popup&redirect_uri=http://<?=App::$DOMAIN?>/fbOauthDone.php?mobile=true'
			},
			popup: {
				vk: 'https://oauth.vk.com/authorize?client_id=<?=App::$SETTINGS->VK->APP_ID?>&scope=groups,friends,email,wall,offline,pages,photos,groups&redirect_uri=http://<?=App::$DOMAIN?>/vkOauthDone.php?mobile=false&response_type=code',
				google: 'https://accounts.google.com/o/oauth2/auth?scope=email profile https://www.googleapis.com/auth/plus.login &redirect_uri=http://<?=App::$DOMAIN?>/googleOauthDone.php?mobile=false&response_type=token&client_id=403640417782-lfkpm73j5gqqnq4d3d97vkgfjcoebucv.apps.googleusercontent.com',
				facebook: 'https://www.facebook.com/dialog/oauth?client_id=1692270867652630&response_type=code&scope=public_profile,email,user_friends&display=popup&redirect_uri=http://<?=App::$DOMAIN?>/fbOauthDone.php?mobile=false'
			}
		};

		function openAuthLink(type) {
			if (isNotDesktop()) {
				window.location.href = _oauth_urls.mobile[type];
			} else {
				window.open(_oauth_urls.popup[type], type.toUpperCase() + '_AUTH_WINDOW',
					'status=1,toolbar=0,menubar=0&height=500,width=700');
			}
		}

		$('.vk-auth-btn').on('click', function() {
			yaCounter32442130.reachGoal('VkAuthStart');
			openAuthLink('vk');
		});

		$('.google-plus-btn').on('click', function() {
			yaCounter32442130.reachGoal('GoogleAuthStart');
			openAuthLink('google');
		});

		$('.facebook-btn').on('click', function() {
			yaCounter32442130.reachGoal('FacebookAuthStart');
			openAuthLink('facebook');
		});
	})
</script>