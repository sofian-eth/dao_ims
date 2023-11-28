const hubspot = require('@hubspot/api-client')
// const {HUBSPOT_KEY} = require('./keys');
require('dotenv').config()
const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_KEY })
async function createContact(dataObject) {
    let contactObj = {
        properties: {
            lastname: dataObject.name,
            email: dataObject.email,
            phone: dataObject.phoneNumber,
            BLOC_KYC:dataObject.leadType ?? null
        }
    }
    try {
        const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj)
    }
    catch (err) {
        console.log(err);
    }
}
async function updateUserPhoneNumber(email, phoneNumber,legalName) {
    let contactObj = {
            name: legalName,
            email: email,
            phoneNumber: phoneNumber,
    }
    const sort = JSON.stringify({ propertyName: 'createdate', direction: 'DESCENDING' })

    const searchRequest = {
        query: email,
        limit: 100, 
        after: 0,
        
        filterGroups: [
            {
                filters: [
                    {
                        propertyName: 'email',
                        operator: 'CONTAINS_TOKEN',
                        value: email
                    }
                ]
            }
        ],
        sorts: [
            sort
        ]
    };
    
    try {
        hubspotClient.crm.contacts.searchApi.doSearch(searchRequest).then(result => { 
            if (result.total > 0 && result.results.length > 0) {
                let hubSpotID = result.results[0].id;

                const updatedContact = {
                    properties: {
                        phone: phoneNumber,
                        lastname: legalName,
                    }
                };
                hubspotClient.crm.contacts.basicApi.update(hubSpotID, updatedContact).then(data => {                
                    console.log('Updated HubSpot User',hubSpotID,email);
                });
            }
            else{
                createContact(contactObj);
            }
        });
    } catch (error) {        
        console.error('Error', error);
    }
}
module.exports.createContact = createContact;
module.exports.updateUserPhoneNumber = updateUserPhoneNumber;