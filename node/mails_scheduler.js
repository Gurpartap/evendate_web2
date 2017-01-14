class MailScheduler {


    handleError(){
        console.log(args);
    }

    constructor(client, errorHandler) {
        this.client = client;
        this.handleError = errorHandler;
    }


    scheduleOrganizationRegistrationFailed(){
        let q_get_failed_registrations = 'SELECT' +
            ' email,' +
            ' name' +
            ' FROM organization_registrations' +
            ' LEFT JOIN emails ON recipient = organization_registrations.email' +
            ' AND email_type_id = (SELECT id' +
            ' FROM email_types' +
            ' WHERE type_code = \'registration_failed\')' +
            ' WHERE finished = FALSE' +
            ' AND' +
            ' DATE_PART(\'epoch\', NOW()) :: INT - DATE_PART(\'epoch\', organization_registrations.created_at) :: INT > 86400 ' +
            ' AND emails.id IS NULL;';
        this.client.query(q_get_failed_registrations, [], function(err, res){
            if (err){

            }
        })
    }
}

module.exports = MailScheduler;