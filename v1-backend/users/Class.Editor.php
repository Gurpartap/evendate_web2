<?php

	require_once $BACKEND_FULL_PATH . '/events/Class.Event.php';

	class Editor extends User{

		protected function addNewEvent(array $data){

			if (isset($data['organization_id'])){
				$organization = OrganizationsCollection::one(
					$this->getDB(),
					$this,
					intval($data['organization_id']));
				if (!$this->isEditor($organization))
					throw new PrivilegesException('Вы не являетесь редактором данной организации', $this->getDB());
			}else{
				$organization = $this->getDefaultOrganization();
			}

			return Event::create($this->getDB(), $organization, array_merge($data, array(
				'image_extensions' => array(
					'vertical' => $this->getImageExtension($data['file_names']['vertical']),
					'horizontal' => $this->getImageExtension($data['file_names']['horizontal'])
				),
				'creator_id' => $this->getId()
			)));
		}

		public function isEditor(Organization $organization = null) {
			if ($organization instanceof Organization){
				$q_get_org = 'SELECT users_organizations.organization_id
					FROM users_organizations
					WHERE users_organizations.status = 1
					AND users_organizations.user_id = :user_id
					AND users_organizations.organization_id = :organization_id;';
				$p_get_default = $this->getDB()->prepare($q_get_org);
				$result = $p_get_default->execute(array(
					':user_id' => $this->getId(),
					':organization_id' => $organization->getId()
				));
				if ($result === FALSE) throw new DBQueryException('', $this->getDB());
				return $p_get_default->rowCount() != 0;
			}else{
				return $this->is_editor;
			}
		}

		public function getImageExtension($file_name){
			if (!isset($file_name) || $file_name == ''){
				return '';
			}else{
				$file_name_parts = explode('.', $file_name);
				return end($file_name_parts);
			}
		}

		public function getDefaultOrganization() : Organization {
			$q_get_default = 'SELECT users_organizations.organization_id
				FROM users_organizations
				WHERE users_organizations.status = 1
				AND users_organizations.user_id = :user_id
				ORDER BY by_default DESC
				LIMIT 1';
			$p_get_default = $this->getDB()->prepare($q_get_default);
			$result = $p_get_default->execute(array(
				':user_id' => $this->getId()
			));
			if ($result === FALSE) throw new DBQueryException('', $this->getDB());
			$row = $p_get_default->fetch();
			return OrganizationsCollection::one(
				$this->getDB(),
				$this,
				intval($row['organization_id'])
			);
		}

	}