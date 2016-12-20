<?php

require_once $BACKEND_FULL_PATH . '/users/Class.Friend.php';

class RegisteredUser extends Friend
{

	const REGISTRATION_INFO_FIELD_NAME = 'registration_info';

	public function getParams(AbstractUser $user = null, array $fields = null): Result
	{
		$result_data = parent::getParams($user, $fields)->getData();


		if (isset($fields[self::SUBSCRIPTIONS_FIELD_NAME])) {
			$result_data[self::SUBSCRIPTIONS_FIELD_NAME] =
				$this->getSubscriptions(
					Fields::parseFields($fields[self::SUBSCRIPTIONS_FIELD_NAME]['fields'] ?? ''),
					array(
						'length' => $fields[self::SUBSCRIPTIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
						'offset' => $fields[self::SUBSCRIPTIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET,
					),
					Fields::parseOrderBy($fields[self::SUBSCRIPTIONS_FIELD_NAME]['order_by'] ?? '')
				)->getData();
		}

		if (isset($fields[self::ACCOUNTS_LINKS_FIELD_NAME])) {

			$account_links = array();

			if ($this->vk_uid != null) {
				$account_links['vk'] = 'https://vk.com/id' . $this->vk_uid;
			}
			if ($this->google_uid != null) {
				$account_links['google'] = 'https://plus.google.com/u/0/' . $this->google_uid;
			}
			if ($this->facebook_uid != null) {
				$account_links['facebook'] = 'https://facebook.com/' . $this->facebook_uid;
			}
			$result_data[self::ACCOUNTS_LINKS_FIELD_NAME] = $account_links;
		}

		if (isset($fields[self::ACCOUNTS_FIELD_NAME])) {

			$account_types = array();

			if ($this->vk_uid != null) {
				$account_types[] = 'vk';
			}
			if ($this->google_uid != null) {
				$account_types[] = 'google';
			}
			if ($this->facebook_uid != null) {
				$account_types[] = 'facebook';
			}
			$result_data[self::ACCOUNTS_FIELD_NAME] = $account_types;
		}

		if (isset($fields[self::ACTIONS_FIELD_NAME])) {
			$result_data[self::ACTIONS_FIELD_NAME] = OrganizationsCollection::filter(
				App::DB(),
				App::getCurrentUser(),
				array(
					'friend' => $this
				),
				Fields::parseFields($fields[self::ACTIONS_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::ACTIONS_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::ACTIONS_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET,
				),
				Fields::parseOrderBy($fields[self::ACTIONS_FIELD_NAME]['order_by'] ?? ''))->getData();
		}
		if (isset($fields[self::FAVORED_FIELD_NAME])) {
			$result_data[self::FAVORED_FIELD_NAME] = EventsCollection::filter(
				App::DB(),
				App::getCurrentUser(),
				array(
					'favorites' => $this
				),
				Fields::parseFields($fields[self::FAVORED_FIELD_NAME]['fields'] ?? ''),
				array(
					'length' => $fields[self::FAVORED_FIELD_NAME]['length'] ?? App::DEFAULT_LENGTH,
					'offset' => $fields[self::FAVORED_FIELD_NAME]['offset'] ?? App::DEFAULT_OFFSET,
				),
				Fields::parseOrderBy($fields[self::FAVORED_FIELD_NAME]['order_by'] ?? ''))->getData();
		}

		return new Result(true, '', $result_data);
	}


}