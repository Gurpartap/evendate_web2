<?php

require_once $BACKEND_FULL_PATH . '/events/networking/Class.NetworkingProfilesCollection.php';
require_once $BACKEND_FULL_PATH . '/events/networking/Class.NetworkingRequestsCollection.php';


class NetworkingManager
{

	private $user;
	private $event;
	private $db;

	/**
	 * NetworkingManager constructor.
	 * @param Event $event
	 * @param User $user
	 * @param ExtendedPDO $db
	 * @param null $code
	 * @throws PrivilegesException
	 */
	public function __construct(Event $event, User $user, ExtendedPDO $db, $code = null)
	{
		$this->user = $user;
		$this->event = $event;
		$this->db = $db;
		$q_get_tickets = App::queryFactory()->newSelect();
		$q_get_tickets
			->cols(array('event_id', 'user_id'))
			->from('view_networking_access')
			->where('event_id = ?', $event->getId())
			->where('user_id = ?', $user->getId());


		//check that we have access to networking for the event
		if ($db->prepareExecute($q_get_tickets)->rowCount() == 0) {
			if ($code != null) {
				$this->accessByCode($code);
			} else {
				throw new PrivilegesException('', $db);
			}
		}
	}

	public function accessByCode($code)
	{
		$q_check_code = App::queryFactory()->newSelect();
		$q_check_code->from('events')
			->where('event_id = ?', $this->event->getId())
			->where('networking_code = ? ', $code);

		if ($this->db->prepareExecute($q_check_code)->rowCount() == 0)
			throw new PrivilegesException('BAD_CODE', $this->db);

		$q_ins_access = App::queryFactory()->newInsert();
		$q_ins_access
			->into('networking_access')
			->cols(array(
				'event_id' => $this->event->getId(),
				'user_id' => $this->user->getId(),
				'status' => true
			))
			->onConflictUpdate(array('event_id', 'user_id'), array('status' => true));

		return true;
	}

	private function getMyProfileInstance(): NetworkingProfile
	{
		$profile = NetworkingProfilesCollection::filter($this->db, $this->user,
			array(
				'user' => $this->user,
				'event' => $this->event,
			),
			array());
		$profile->setDb($this->db);
		$profile->setNetworkingManager($this);
		return $profile;
	}

	public function saveMyProfile(array $data)
	{
		return $this->getMyProfileInstance()->save($data);
	}

	/**
	 * @return User
	 */
	public function getUser(): User
	{
		return $this->user;
	}

	/**
	 * @return Event
	 */
	public function getEvent(): Event
	{
		return $this->event;
	}


	public function getMyProfile(array $fields)
	{
		return $this->getMyProfileInstance()->getParams($this->user, $fields);
	}


	// it's little bit smelly, but needs to check access to current event (cant be in controller)
	public function getProfilesList(array $filters, array $fields, array $pagination, array $order_by)
	{
		return NetworkingProfilesCollection::filter(
			$this->db,
			$this->user,
			array_merge($filters, array('event' => $this->event, 'for_user' => $this->user)),
			$fields,
			$pagination,
			$order_by
		);
	}


	// it's little bit smelly, but needs to check access to current event (cant be in controller)
	public function getProfile($user_id, array $fields)
	{
		return NetworkingProfilesCollection::filter(
			$this->db,
			$this->user,
			array('event' => $this->event, 'user' => $this->user, 'user_id' => $user_id),
			$fields
		)->getParams($this->user, $fields);
	}

	public function saveMyRequest(array $request)
	{
		return NetworkingRequest::save($this, $this->db, $request);
	}

	public function updateRequest($uuid, array $data)
	{
		$req = $this->getRequestInstance($uuid, array());
		$req->setDb($this->db);
		$req->setNetworkingManager($this);
		return $req->update($data);
	}

	public function getRequestsList(array $fields, array $pagination, array $order_by)
	{
		return NetworkingRequestsCollection::filter(
			$this->db,
			$this->user,
			array('event' => $this->event, 'user' => $this->user),
			$fields,
			$pagination,
			$order_by
		);
	}

	private function getRequestInstance($uuid, array $fields): NetworkingRequest
	{
		return NetworkingRequestsCollection::filter(
			$this->db,
			$this->user,
			array('event' => $this->event, 'user' => $this->user, 'uuid' => $uuid),
			$fields
		);
	}

	public function getRequest($uuid, array $fields)
	{
		$request = $this->getRequestInstance($uuid, $fields)->getParams($this->user, $fields);
		return new Result(true, '', $request->getData());
	}

	public function getContactsList($fields, $pagination, $order_by)
	{
		return NetworkingProfilesCollection::filter(
			$this->db,
			$this->user,
			array('event' => $this->event, 'contacts' => true),
			$fields,
			$pagination,
			$order_by
		);
	}

}