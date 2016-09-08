<?php

/**
 * Created by PhpStorm.
 * User: kardi
 * Date: 14.06.2016
 * Time: 13:39
 */
class OrganizationsStatistics extends AbstractAggregator
{


    private $db;
    private $organization;


    public function __construct(PDO $db, Organization $organization, User $user)
    {
        if (!$user->isAdmin($organization)) throw new PrivilegesException('', $db);
        $this->db = $db;
        $this->organization = $organization;
    }


    private function getValue($type, $scale, DateTime $since, DateTime $till)
    {
        $query = '';
        switch ($type) {
            case Statistics::ORGANIZATION_UNSUBSCRIBE:
            case Statistics::ORGANIZATION_SUBSCRIBE: {
                $query = self::SQL_GET_SUBSCRIBED;
                break;
            }
            case Statistics::ORGANIZATION_OPEN_SITE:
            case Statistics::ORGANIZATION_VIEW: {
                $query = self::SQL_GET_VIEWS;
                break;
            }
            case Statistics::EVENT_FAVE: {
                $query = self::SQL_GET_FAVORED;
                break;
            }
            case Statistics::EVENT_NOTIFICATIONS_SENT: {
                $query = self::SQL_GET_NOTIFICATIONS;
                break;
            }
        }

        return self::iterate(
            $query,
            array(
                ':organization_id' => $this->organization->getId(),
                ':entity' => Statistics::ENTITY_ORGANIZATION,
                ':type_code' => $type,
            ),
            $since,
            $till,
            $scale
        );
    }


    public function get(array $fields, $scale, DateTime $since, DateTime $till)
    {
        $result = array();
        foreach ($fields as $key => $value) {
            switch ($key) {
                case Statistics::FIELD_DYNAMICS: {
                    $result[Statistics::FIELD_DYNAMICS] = $this->getDynamics(
                        Fields::parseFields($value['fields'] ?? ''),
                        $value['scale'] ?? $scale,
                        isset($value['since']) ? DateTime::createFromFormat('U', $value['since']) : $since,
                        isset($value['till']) ? DateTime::createFromFormat('U', $value['till']) : $till
                    )->getData();
                    break;
                }
                case Statistics::FIELD_CONVERSION: {
                    $result[Statistics::FIELD_CONVERSION] = $this->getConversion(
                        $value['scale'] ?? $scale,
                        isset($value['since']) ? DateTime::createFromFormat('U', $value['since']) : $since,
                        isset($value['till']) ? DateTime::createFromFormat('U', $value['till']) : $till
                    )->getData();
                    break;
                }
                case Statistics::FIELD_AUDIENCE: {
                    $result[Statistics::FIELD_AUDIENCE] = $this->getAudience()->getData();
                    break;
                }
                case Statistics::EVENT_FAVE:
                case Statistics::ORGANIZATION_OPEN_SITE:
                case Statistics::ORGANIZATION_UNSUBSCRIBE:
                case Statistics::ORGANIZATION_SUBSCRIBE:
                case Statistics::ORGANIZATION_VIEW: {
                    $result[$key] = $this->getValue(
                        $key,
                        $value['scale'] ?? $scale,
                        isset($value['since']) ? DateTime::createFromFormat('U', $value['since']) : $since,
                        isset($value['till']) ? DateTime::createFromFormat('U', $value['till']) : $till
                    )->getData();
                    break;
                }
            }
        }
        return new Result(true, '', $result);
    }

    private function getDynamics(array $fields = null, $scale, DateTime $since, DateTime $till)
    {
        $default_fields = array(
            Statistics::ORGANIZATION_SUBSCRIBE => null,
            Statistics::ORGANIZATION_VIEW => null,
            Statistics::EVENT_FAVE => null
        );

        if (!is_array($fields) || (is_array($fields) && count($fields) == 0)) {
            $fields = $default_fields;
        }
        $result = array();

        foreach ($fields as $key => $param) {
            switch ($key) {
                case Statistics::ORGANIZATION_VIEW:
                case Statistics::EVENT_FAVE:
                case Statistics::ORGANIZATION_SUBSCRIBE: {
                    $result[$key] = $this->getValue($key, $scale, $since, $till)->getData();
                    break;
                }
                case Statistics::FIELD_CONVERSION: {
                    $result[Statistics::FIELD_CONVERSION] = $this->getConversion($scale, $since, $till)->getData();
                    break;
                }
            }
        }
        return new Result(true, '', $result);
    }

    private function getConversion($scale, $since, $till)
    {
        $views = $this->getValue(
            Statistics::ORGANIZATION_VIEW,
            $scale,
            $since,
            $till
        )->getData();

        $subscribes = $this->getValue(
            Statistics::ORGANIZATION_SUBSCRIBE,
            $scale,
            $since,
            $till
        )->getData();

        $result = array();

        foreach ($views as $key => $view) {
            $result[] = array(
                'since' => $view['since'],
                'till' => $view['till'],
                'subscribe' => $subscribes[$key]['value'],
                'view' => $view['value'],
                'value' => $view['value'] == 0 ? 0 : $subscribes[$key]['value'] / $view['value'] * 100
            );
        }
        return new Result(true, '', $result);
    }

    private function getAudience()
    {
        $p_get_devices = $this->db->prepare(self::SQL_GET_AUDIENCE_DEVICES);
        $p_get_gender = $this->db->prepare(self::SQL_GET_AUDIENCE_GENDER);
        $data = array(
            ':organization_id' => $this->organization->getId()
        );
        $result = $p_get_devices->execute($data);
        if ($result === FALSE) throw new DBQueryException('CANT_GET_DEVICES', $this->db);


        $result = $p_get_gender->execute($data);
        if ($result === FALSE) throw new DBQueryException('CANT_GET_GENDERS', $this->db);

        $devices = $p_get_devices->fetchAll();
        $res_devices = array();
        $keys = array();

        foreach ($devices as $type) {
            if (isset($keys[$type['name']])) {
                $keys[$type['name']] += $type['count'];
            } else {
                $keys[$type['name']] = $type['count'];
            }
        }
        foreach ($keys as $name => $count) {
            $res_devices[] = array('name' => $name, 'count' => $count);
        }

        $result = array(
            'devices' => $res_devices,
            'gender' => $p_get_gender->fetchAll()
        );
        return new Result(true, '', $result);
    }
}