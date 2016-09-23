<?php

class AbstractAggregator
{


    protected function replaceScale($query, $scale){
        if (mb_strtolower($scale) == 'overall'){
            $scale = 'century';
        }
        $query = str_replace('{SCALE}', $scale, $query);
        return $query;
    }

}