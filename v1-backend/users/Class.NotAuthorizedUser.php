<?php


class NotAuthorizedUser extends AbstractUser {

	public function getId()
	{
		return -1;
	}

	public function getMainInfo(array $fields)
	{

		$result_data = array(array(
			'first_name' => $this->getFirstName(),
			'last_name' => $this->getLastName(),
			'id' => $this->getId(),
			'avatar_url' => $this->getAvatarUrl(),
			'blurred_image_url' => $this->blurred_image_url,
			'middle_name' => $this->getMiddleName(),
			'is_editor' => false,
			'accounts' => array()
		));
		return new Result(true, '', $result_data);
	}

	public function getTokenId(){
		return null;
	}
}