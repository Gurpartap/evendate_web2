<?php

class AbstractAggregator
{


    /**
     * AbstractAggregator constructor.
     */
    public function __construct()
    {

    }


    protected function getScaleInterval($scale) : DateInterval
    {
        if (!in_array($scale, Statistics::SCALES)) throw new InvalidArgumentException('INVALID_SCALE');

        switch ($scale) {
            case Statistics::SCALE_MINUTE: {
                return new DateInterval('PT1M');
            }
            case Statistics::SCALE_HOUR: {
                return new DateInterval('P1H');
            }
            case Statistics::SCALE_DAY: {
                return new DateInterval('P1D');
            }
            case Statistics::SCALE_WEEK: {
                return new DateInterval('P1W');
            }
            case Statistics::SCALE_MONTH: {
                return new DateInterval('P1M');
            }
            case Statistics::SCALE_YEAR: {
                return new DateInterval('P1Y');
            }
            case Statistics::SCALE_OVERALL: {
                return new DateInterval('P100Y');
            }
        }
    }

    protected function iterate(PDOStatement $query, array $data, DateTime $d_since, DateTime $d_till, $scale)
    {
        $iterate_start = clone $d_till;
        $interval = $this->getScaleInterval($scale);
        $return_values = array();
        $count = 0;
        while($iterate_start >= $d_since && $count++ < 1000){
//            echo $iterate_start->format('Y-m-d H:i:s');
//            echo "\n";

            $till = $iterate_start->getTimestamp();
            $since = $iterate_start->sub($interval)->getTimestamp();
//            echo $iterate_start->format('Y-m-d H:i:s');
            $result = $query->execute(array_merge($data,
                array(
                    ':till' => $till,
                    ':since' => $since
                )));
            if ($result === FALSE) throw new DBQueryException('CANT_GET_VIEWS', $this->db);
            $return_values[] = array(
                'till' => $till,
                'since' => $since,
                'value' => $query->fetchColumn(0)
            );
        }
        return new Result(true, '', $return_values);
    }

}