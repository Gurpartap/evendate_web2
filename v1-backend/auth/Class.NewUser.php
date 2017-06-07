<?php


class NewUser
{

	private static $email;
	private static $user_id;
	private static $token;

	/**
	 * NewUser constructor.
	 * @param array $user_data
	 */
	public function __construct(array $user_data)
	{
		self::$user_id = $user_data['user_id'];
		self::$token = $user_data['token'];
		self::$email = $user_data['email'];
	}


	public static function setSession(array $data = null)
	{
		$_SESSION['email'] = $data['email'] ?? self::$email;
		$_SESSION['id'] = $data['user_id'] ?? self::$user_id;
		$_SESSION['token'] = $data['token'] ?? self::$token;
	}

}