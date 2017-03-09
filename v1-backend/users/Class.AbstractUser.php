<?php

require_once $BACKEND_FULL_PATH . '/users/Interface.UserInterface.php';

abstract class AbstractUser implements UserInterface
{


	protected $id;
	protected $first_name;
	protected $last_name;
	protected $middle_name;
	protected $email;
	protected $token;
	protected $avatar_url;
	protected $is_editor;
	protected $token_id;
	protected $blurred_image_url;

	protected $google_uid;
	protected $facebook_uid;
	protected $vk_uid;


	public abstract function getId();

	public function getToken()
	{
		return $this->token;
	}

	/**
	 * @return mixed
	 */
	public function getEmail()
	{
		return $this->email;
	}

	/**
	 * @return mixed
	 */
	public function getCreatedAt()
	{
		return $this->created_at;
	}

	public function getInterests()
	{
		$q_get_interests = App::queryFactory()->newSelect();
		$q_get_interests
			->from('users_interests')
			->cols(array(
				'city',
				'education_university',
				'education_university_name',
				'education_faculty',
				'education_faculty_name',
				'education_graduation',
				'occupation_id',
				'occupation_name',
				'relation',
				'personal_political',
				'personal_smoking',
				'personal_alcohol',
				'interests',
				'movies',
				'tv',
				'books',
				'games',
				'about'
			))
			->where('user_id = ?', $this->id);

		$p_get = $this->db->prepareExecute($q_get_interests, 'CANT_GET_INTERESTS');


		$q_get_subscribed_groups = App::queryFactory()->newSelect()
			->from('vk_groups')
			->cols(array('CONCAT_WS(\' \',name, description) AS text'))
			->join('inner', 'vk_users_subscriptions', 'vk_groups.id=vk_users_subscriptions.vk_group_id')
			->where('vk_users_subscriptions.user_id = ?', $this->id);

		$p_get_groups = $this->db->prepareExecute($q_get_subscribed_groups, 'CANT_GET_INTERESTS');
		$groups = $p_get_groups->fetchAll();
		$groups_text = array();
		foreach ($groups as $group) {
			$groups_text[] = $group['text'];
		}


		$result = $p_get->fetch();
		$result['groups'] = implode(' ', $groups_text);

		return new Result(true, '', $result);

	}

	public function getAvatarUrl()
	{
		return $this->avatar_url;
	}

	public function getFirstName()
	{
		return $this->first_name;
	}

	public function getLastName()
	{
		return $this->last_name;
	}

	public function getMiddleName()
	{
		return $this->middle_name;
	}

	public abstract function getMainInfo(array $fields);

	public abstract function getTokenId();

	public function getSettings(){
		return null;
	}
}