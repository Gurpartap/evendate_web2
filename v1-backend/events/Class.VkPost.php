<?php


class VkPost
{

	public static function create(&$data, Editor $user, \GuzzleHttp\Client $http_client)
	{

		global $ROOT_PATH;

		$image_data = self::savePostImage($data['image'], $data['filename'], $data['guid']);

		$access_token = $user->getVkAccessToken()['access_token'];

		$req_params = array(
			'access_token' => $access_token,
			'group_id' => $data['guid']
		);

		$upload_url_res = $http_client->request('GET', 'https://api.vk.com/method/photos.getWallUploadServer',
			array(
				'query' => $req_params
			));

		$res = App::getBodyJSON($upload_url_res, true);

		if (isset($res['error'])) throw new RuntimeException($res['error']['error_msg']);

		$upload_res = $http_client->request('POST', $res['response']['upload_url'],
			array(
				'multipart' => array(
					array(
						'name' => 'file1',
						'contents' => fopen($ROOT_PATH . $image_data['path'], 'r'),
					)
				)
			));

		$upload_data = App::getBodyJSON($upload_res);

		if (isset($upload_data['error'])) throw new RuntimeException($upload_data['error']['error_msg']);


		$request_data = $req_params;
		$request_data['server'] = $upload_data['server'];
		$request_data['hash'] = $upload_data['hash'];
		$request_data['photo'] = $upload_data['photo'];

		$save_res = $http_client->request('GET', 'https://api.vk.com/method/photos.saveWallPhoto',
			array(
				'query' => $request_data
			));

		$image_res = App::getBodyJSON($save_res, true);

		$save_res = $http_client->request('POST', 'https://api.vk.com/method/wall.post',
			array(
				'query' => array(
					'owner_id' => '-' . $data['guid'],
					'from_group' => '1',
					'access_token' => $access_token,
					'guid' => $data['event_id'],
					'attachments' => implode(',', array($image_res['response'][0]['id'], $data['link'] ?? 'https://evendate.io/event/' . $data['event_id'])),
				),
				'form_params' => array(
					'message' => $data['description'],
				)
			));

		$image_res = App::getBodyJSON($save_res, true);

		if (isset($image_res['error'])) throw new RuntimeException($image_res['error']['error_msg']);

		if (isset($image_res['response']) && isset($image_res['response']['post_id'])) {
			$q_ins = App::queryFactory()->newInsert();
			$q_ins->into('vk_posts')
				->cols(array(
					'creator_id' => $user->getId(),
					'image_path' => $image_data['path'],
					'message' => $data['description'],
					'event_id' => $data['event_id'],
					'post_id' => $image_res['response']['post_id'],
					'group_id' => $data['guid']
				));
			App::DB()->prepareExecute($q_ins, 'CANT_SAVE_VK_POST');
		}

		return $image_res;
	}


	private static function savePostImage($file, $filename, $uid)
	{
		$ext = App::getImageExtension($filename);
		$filename = $uid . '__' . md5(time()) . '.' . $ext;
		$path = Event::IMAGES_PATH . Event::IMG_VK_POST_COVER . '/' . $filename;
		App::saveImage($file, $path, 50000);
		return array(
			'filename' => $filename,
			'path' => $path,
			'ext' => $ext
		);
	}
}