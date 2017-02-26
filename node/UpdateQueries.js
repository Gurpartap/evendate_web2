let fs = require('fs');
module.exports = {
    upd_event_recommendations: fs.readFileSync('./sql/upd_event_recommendations.sql', {encoding: 'utf8'}),
    upd_org_recommendations: fs.readFileSync('./sql/upd_org_recommendations.sql', {encoding: 'utf8'}),
};