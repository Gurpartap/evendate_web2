<?php

require_once $BACKEND_FULL_PATH . '/users/Class.Roles.php';

class User extends AbstractUser
{


	protected $send_notifications_new_organizations;
	protected $send_notifications_for_friends;
	protected $send_notifications_for_favored;
	protected $send_notifications_for_subscriptions;
	protected $send_notifications;
	protected $privacy_mode;
	protected $created_at;

	private $editor_instance;
	protected $db;

	const SETTINGS = array(
		'send_notifications' => 'boolean',
		'send_notifications_for_favored' => 'boolean',
		'send_notifications_for_subscriptions' => 'boolean',
		'send_notifications_new_organizations' => 'boolean',
		'send_notifications_for_friends' => 'boolean',
		'privacy_mode' => array('public', 'only_friends', 'private')
	);

	public function __construct(PDO $db, $token = null)
	{
		if ((!isset($_SESSION['id']) || trim($_SESSION['id']) == ''
				|| !isset($_SESSION['token']) || trim($_SESSION['token']) == '')
			&& $token == null
		) {
			throw new AuthorizationException('Пользователь с такими данными не найден', $db);
		}
		if (isset($_SESSION['id'])) {
			$p_get_user = $db->prepare("SELECT users.*, tokens.id AS token_id,
				(SELECT COUNT(user_id)::INT FROM users_organizations WHERE user_id = users.id AND status = TRUE) > 0 AS is_editor
				FROM users
				INNER JOIN tokens ON tokens.user_id = users.id
				WHERE users.id = :id
				AND tokens.token = :token
				AND tokens.expires_on > DATE_PART('epoch', CURRENT_TIMESTAMP)::INT");
			$stm = array(
				':id' => $_SESSION['id'],
				':token' => $_SESSION['token']
			);
		} else {
			$p_get_user = $db->prepare("SELECT users.*,tokens.id AS token_id,
				(SELECT COUNT(user_id) FROM users_organizations WHERE user_id = users.id AND status = TRUE) > 0 AS is_editor
				FROM users
				INNER JOIN tokens ON tokens.user_id = users.id
				WHERE
					tokens.token = :token");
			$stm = array(':token' => $token);
		}

		$p_get_user->execute($stm);

		if ($p_get_user === FALSE) throw new DBQueryException('USER_NOT_EXIST', $db);
		if ($p_get_user->rowCount() !== 1) throw new AuthorizationException('Пользователь с такими данными не найден', $db);
		$row = $p_get_user->fetch();

		$this->db = $db;
		$this->id = $row['id'];
		$this->first_name = $row['first_name'];
		$this->last_name = $row['last_name'];
		$this->middle_name = $row['middle_name'];
		$this->email = $row['email'];
		$this->token = $token ? $token : $_SESSION['token'];
		$this->avatar_url = $row['avatar_url'];
		$this->is_editor = $row['is_editor'];
		$this->token_id = $row['token_id'];
		$this->blurred_image_url = $row['blurred_image_url'];
		$this->created_at = $row['created_at'];

		$this->vk_uid = $row['vk_uid'];
		$this->facebook_uid = $row['facebook_uid'];
		$this->google_uid = $row['google_uid'];

		$this->send_notifications = $row['send_notifications'];
		$this->send_notifications_for_favored = $row['send_notifications_for_favored'];
		$this->send_notifications_for_subscriptions = $row['send_notifications_for_subscriptions'];
		$this->send_notifications_new_organizations = $row['send_notifications_new_organizations'];
		$this->send_notifications_for_friends = $row['send_notifications_for_friends'];
		$this->privacy_mode = $row['privacy_mode'];
	}

	public function getId()
	{
		return $this->id;
	}


	public function isAdmin(Organization $organization) : bool
	{
		$q_get_is_admin = App::queryFactory()
			->newSelect()
			->from('users_organizations')
			->cols(array('user_id'))
			->join('inner', 'users_roles', 'users_organizations.role_id = users_roles.id')
			->where('organization_id = ?', $organization->getId())
			->where('users_organizations.user_id = ?', $this->getId())
			->where('status = TRUE')
			->where('users_roles.name = ?', Roles::ROLE_ADMIN);
		$p_get = $this->db->prepare($q_get_is_admin->getStatement());
		$result = $p_get->execute($q_get_is_admin->getBindValues());
		if ($result === FALSE) throw new DBQueryException('CANT_GET_ADMIN_STATUS', $this->db);
		return $p_get->rowCount() > 0;
	}

	public function isEventAdmin(Event $event) : bool
	{
		$q_get_is_admin = App::queryFactory()
			->newSelect()
			->from('users_organizations')
			->cols(array('user_id'))
			->join('inner', 'users_roles', 'users_organizations.role_id = users_roles.id')
			->where('organization_id = ?', $event->getOrganizationId())
			->where('users_organizations.user_id = ?', $this->getId())
			->where('status = TRUE')
			->where('users_roles.name = ?', Roles::ROLE_ADMIN);
		$p_get = $this->db->prepare($q_get_is_admin->getStatement());
		$result = $p_get->execute($q_get_is_admin->getBindValues());
		if ($result === FALSE) throw new DBQueryException('CANT_GET_ADMIN_STATUS', $this->db);
		return $p_get->rowCount() > 0;
	}

	public static function getRoleId($ole)
	{

	}

	protected function getDB() : PDO
	{
		return $this->db;
	}

	public function isEditor()
	{
		return $this->is_editor;
	}

	public function getEditorInstance()
	{
		if (!$this->isEditor()) throw new PrivilegesException('Недостаточно прав для совершения действия', $this->db);
		if ($this->editor_instance instanceof Editor == false) {
			$this->editor_instance = new Editor($this->db);
		}
		return $this->editor_instance;
	}

	public function createEvent($data)
	{
		return $this->getEditorInstance()->addNewEvent($data);
	}

	public function addFavoriteEvent(Event $event)
	{
		$q_ins_favorite = 'INSERT INTO favorite_events(user_id, event_id, status, created_at)
			VALUES (:user_id, :event_id, TRUE, NOW())
			ON CONFLICT (user_id, event_id) DO UPDATE SET status = TRUE RETURNING id::INT';
		$p_ins_favorite = $this->db->prepare($q_ins_favorite);
		$result = $p_ins_favorite->execute(array(
			':user_id' => $this->getId(),
			':event_id' => $event->getId()
		));
		if ($result === FALSE) throw new DBQueryException('CANT_MAKE_FAVORITE', $this->db);

		return new Result(true, 'Событие успешно добавлено в избранное');
	}

	public function deleteFavoriteEvent(Event $event)
	{
		$q_upd_favorite = 'UPDATE favorite_events SET status = FALSE
			WHERE  user_id = :user_id
			 AND event_id = :event_id';
		$p_ins_favorite = $this->db->prepare($q_upd_favorite);
		$result = $p_ins_favorite->execute(array(
			':user_id' => $this->getId(),
			':event_id' => $event->getId()
		));
		if ($result === FALSE) throw new DBQueryException('CANT_DELETE_FAVORITE', $this->db);
		return new Result(true, 'Событие успешно удалено из избранных');
	}

	public function hasFavoriteEvent(Event $event)
	{
		$q_get_is_fav = 'SELECT id::INT FROM favorite_events
			WHERE
			user_id = :user_id
			AND event_id = :event_id
			AND status = TRUE';
		$p_get_is_fav = $this->db->prepare($q_get_is_fav);
		$p_get_is_fav->execute(array(
			':user_id' => $this->getId(),
			':event_id' => $event->getId()
		));
		if ($p_get_is_fav === FALSE) return new Result(false, '', false);
		return new Result(true, '', $p_get_is_fav->rowCount() == 1);
	}

	public function updateSettings($__request)
	{
		$q_upd = App::queryFactory()
			->newUpdate()
			->table('users')
			->where('id = ?', $this->getId());

		$cols = array();

		foreach (self::SETTINGS as $key => $data_type) {
			if (isset($__request[$key])) {
				if ($data_type == 'boolean') {
					$this->$key = filter_var($__request[$key], FILTER_VALIDATE_BOOLEAN);
					$cols[$key] = filter_var($__request[$key], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
				} elseif (is_array($data_type)) {
					if (in_array($__request[$key], $data_type) == false) throw new InvalidArgumentException('UNEXPECTED_VALUES');
					$this->$key = $__request[$key];
					$cols[$key] = $__request[$key];
				}
			}
		}
		$cols['show_to_friends'] = '1';

		$q_upd->cols($cols);
		$p_upd = $this->db->prepare($q_upd->getStatement());
		$result = $p_upd->execute($q_upd->getBindValues());

		if ($result === FALSE) throw new DBQueryException('CANT_UPDATE_SETTINGS', $this->db);

		return new Result(true, '');
	}

	public function logout()
	{
		session_unset();
		session_destroy();
		session_write_close();
	}

	public function getSettings()
	{
		return new Result(true, '', array(
			'send_notifications' => $this->send_notifications,
			'send_notifications_for_favored' => $this->send_notifications_for_favored,
			'send_notifications_for_subscriptions' => $this->send_notifications_for_subscriptions,
			'send_notifications_new_organizations' => $this->send_notifications_new_organizations,
			'send_notifications_for_friends' => $this->send_notifications_for_friends,
			'privacy_mode' => $this->privacy_mode,
			'show_to_friends' => $this->privacy_mode != 'private',
			'notify_in_browser' => $this->send_notifications,
		));
	}

	public function updateDeviceToken($device_token, $client_type, $device_model = null, $device_os_version = null)
	{
		$q_upd_device_token = 'UPDATE tokens SET
			device_token = :device_token,
			client_type = :client_type,
			model = :model,
			os_version = :os_version
			WHERE user_id = :user_id
			AND tokens.token = :token';
		$p_upd = $this->db->prepare($q_upd_device_token);
		$res = $p_upd->execute(array(
			':device_token' => $device_token,
			':user_id' => $this->getId(),
			':token' => $this->token,
			':model' => $device_model,
			':os_version' => $device_os_version,
			':client_type' => $client_type
		));


		//disable same tokens for this user (device tokens can duplicate)
		$q_upd_token = "UPDATE tokens SET expires_on = DATE_PART('epoch', CURRENT_TIMESTAMP)::INT
			WHERE user_id = :user_id
			AND client_type = :client_type
			AND device_token = :device_token
			AND tokens.token != :token";
		$p_upd_token = $this->db->prepare($q_upd_token);
		$res2 = $p_upd_token->execute(array(
			':device_token' => $device_token,
			':user_id' => $this->getId(),
			':token' => $this->token,
			':client_type' => $client_type
		));
		if ($res === FALSE || $res2 === FALSE) throw new DBQueryException('CANT UPDATE TOKEN', $this->db);
		return new Result(true, '', array('token' => $this->token));
	}

	public function getTokenId()
	{
		return $this->token_id;
	}

	public function getMainInfo()
	{

		$account_types = array();
		$account_links = array();

		if ($this->vk_uid != null) {
			$account_types[] = 'vk';
			$account_links['vk'] = 'https://vk.com/id' . $this->vk_uid;
		}
		if ($this->google_uid != null) {
			$account_types[] = 'google';
			$account_links['google'] = 'https://plus.google.com/u/0/' . $this->google_uid;
		}
		if ($this->facebook_uid != null) {
			$account_types[] = 'facebook';
			$account_links['facebook'] = 'https://facebook.com/' . $this->facebook_uid;
		}

		return new Result(true, '', array(
			'first_name' => $this->getFirstName(),
			'last_name' => $this->getLastName(),
			'id' => $this->getId(),
			'avatar_url' => $this->getAvatarUrl(),
			'blurred_image_url' => $this->blurred_image_url,
			'middle_name' => $this->getMiddleName(),
			'is_editor' => $this->isEditor(),
			'accounts' => $account_types,
			'accounts_links' => $account_links
		));
	}

}