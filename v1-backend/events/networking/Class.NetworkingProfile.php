<?php


class NetworkingProfile extends AbstractEntity
{


	private $nm;
	protected $db;

	protected $event_id;
	protected $request_uuid;

	const REQUEST_FIELD_NAME = 'request';

	protected static $DEFAULT_COLS = array(
		'first_name',
		'last_name',
		'avatar_url',
		'event_id',
		'user_id',
		'info',
		'looking_for',
		'vk_url',
		'facebook_url',
		'twitter_url',
		'linkedin_url',
		'telegram_url',
		'instagram_url',
		'github_url',
		'email',
		'signed_up',
		'request_uuid',
		'company_name'
	);

	protected static $ADDITIONAL_COLS = array(
		'created_at',
		'updated_at'
	);

	public function setNetworkingManager(NetworkingManager $nm)
	{
		$this->nm = $nm;
	}

	public function setDb(ExtendedPDO $db)
	{
		$this->db = $db;
	}

	public function save(array $data)
	{
		$data_array = array(
			'user_id' => $this->nm->getUser()->getId(),
			'vk_url' => $data['vk_url'] ?? null,
			'facebook_url' => $data['facebook_url'] ?? null,
			'twitter_url' => $data['twitter_url'] ?? null,
			'linkedin_url' => $data['linkedin_url'] ?? null,
			'telegram_url' => $data['telegram_url'] ?? null,
			'instagram_url' => $data['instagram_url'] ?? null,
			'github_url' => $data['github_url'] ?? null,
			'email' => $data['email'] ?? null,
		);
		$q_ins_profile = App::queryFactory()->newInsert()
			->into('users_profiles')
			->cols($data_array)
			->onConflictUpdate(
				array('user_id'),
				$data_array);
		$this->db->prepareExecute($q_ins_profile);

		$data_array = array(
			'event_id' => $this->nm->getEvent()->getId(),
			'user_id' => $this->nm->getUser()->getId(),
			'info' => $data['info'] ?? null,
			'looking_for' => $data['looking_for'] ?? null
		);
		$q_ins_profile = App::queryFactory()->newInsert()
			->into('networking_goals')
			->cols($data_array)
			->onConflictUpdate(
				array('user_id', 'event_id'),
				$data_array
			);
		$this->db->prepareExecute($q_ins_profile);
		return new Result(true, '');
	}

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();

		if (isset($fields[self::REQUEST_FIELD_NAME])) {
			$event = EventsCollection::one(
				App::DB(),
				$user,
				$this->event_id,
				array()
			);
			$_fields = Fields::parseFields($fields[self::REQUEST_FIELD_NAME]['fields'] ?? '');
			$result_data[self::REQUEST_FIELD_NAME] = NetworkingRequestsCollection::filter(
				App::DB(),
				$user,
				array('event' => $event, 'user' => $user, 'uuid' => $this->request_uuid),
				$_fields
			)->getParams($user, $fields)->getData();

		}
		return new Result(true, '', $result_data);
	}

}