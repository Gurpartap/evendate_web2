CREATE OR REPLACE VIEW view_actions AS SELECT
                                         stat_events.stat_type_id,
                                         stat_events.event_id,
                                         stat_event_types.name,
                                         stat_event_types.entity,
                                         stat_event_types.type_code,
                                         tokens.user_id,
                                         NULL                                                   AS organization_id,
                                         DATE_PART('epoch', MAX(stat_events.created_at)) :: INT AS created_at
                                       FROM stat_events
                                         INNER JOIN stat_event_types ON stat_event_types.id = stat_events.stat_type_id
                                         INNER JOIN tokens ON tokens.id = stat_events.token_id
                                         INNER JOIN view_events ON view_events.id = stat_events.event_id
                                       WHERE

                                         view_events.status = TRUE
                                         AND view_events.is_canceled = FALSE
                                         AND view_events.organization_is_private = FALSE
                                         AND (stat_event_types.type_code = 'fave'
                                              OR stat_event_types.type_code = 'unfave')
                                       GROUP BY stat_events.event_id, tokens.user_id, stat_events.stat_type_id,
                                         stat_event_types.name,
                                         stat_event_types.entity,
                                         stat_event_types.type_code
                                       UNION

                                       SELECT
                                         stat_organizations.stat_type_id,
                                         NULL                                                          AS event_id,
                                         stat_event_types.name,
                                         stat_event_types.entity,
                                         stat_event_types.type_code,
                                         tokens.user_id,
                                         stat_organizations.organization_id                            AS organization_id,
                                         DATE_PART('epoch', MAX(stat_organizations.created_at)) :: INT AS created_at
                                       FROM stat_organizations
                                         INNER JOIN stat_event_types ON stat_event_types.id = stat_organizations.stat_type_id
                                         INNER JOIN tokens ON tokens.id = stat_organizations.token_id
                                         INNER JOIN view_organizations
                                           ON view_organizations.id = stat_organizations.organization_id
                                       WHERE (stat_event_types.type_code = 'subscribe'
                                              OR stat_event_types.type_code = 'unsubscribe')
                                             AND view_organizations.is_private = FALSE
                                       GROUP BY stat_organizations.organization_id, tokens.user_id,
                                         stat_organizations.stat_type_id, stat_event_types.name,
                                         stat_event_types.entity,
                                         stat_event_types.type_code;