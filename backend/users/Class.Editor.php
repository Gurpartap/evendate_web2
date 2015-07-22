<?php

	require_once $ROOT_PATH.'backend/events/Class.Event.php';

	class Editor extends User{

		protected function addNewEvent(array $data){
			return Event::create($this->db, array_merge($data, array(
				'image_ext' => $this->getImageExtension($data['file_name']),
				'organization_id' => $this->getOrganizationId(),
				'creator_id' => $this->getId()
			)));
		}

		private function getOrganizationId() {
			return $this->organization_id;
		}

		private function getImageExtension($file_name){
			if (!isset($file_name) || $file_name == ''){
				return '';
			}else{
				$file_name_parts = explode('.', $file_name);
				return end($file_name_parts);
			}
		}

	}