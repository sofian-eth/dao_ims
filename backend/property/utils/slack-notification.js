const axios=require('axios');
const slackHook = process.env.slackHook;





async function areaPledgeNotification(request){
    try {

        const userAccountNotification = {
            'text': 'Area Pledge Notification', // text
            'icon_emoji': ':bangbang:', // User icon, you can also use custom icons here
            'attachments': [{ // this defines the attachment block, allows for better layout usage
              'color': '#eed140', // color of the attachments sidebar.
              'fields': [ // actual fields
                {
                  'title': 'Project', // Custom field
                  'value': request.projectname,
                  'short': true 
               
                },
                {
                  'title': 'Buyer Email',
                  'value': request.investoremail,
                  'short': true
                 
                },
                {
                    'title': 'Funding Round',
                    'value': request.devround,
                    'short': true
                   
                },
        
                {
                    'title': 'Area Pledge',
                    'value': request.areaunits,
                    'short': true
                   
                },

                {
                    'title': 'Round Price',
                    'value': request.currentprice,
                    'short': true
                   
                },
            ]
            }]
          };
        
        await axios.post(
            slackHook ,
            userAccountNotification
        );

    } catch(error){

    }

}




async function demarcatedAreaPledgeNotification(request){
  try {

      const userAccountNotification = {
          'text': 'Area Pledge Notification', // text
          'icon_emoji': ':bangbang:', // User icon, you can also use custom icons here
          'attachments': [{ // this defines the attachment block, allows for better layout usage
            'color': '#eed140', // color of the attachments sidebar.
            'fields': [ // actual fields
              {
                'title': 'Project', // Custom field
                'value': request.project,
                'short': true 
             
              },
              {
                'title': 'Buyer Email',
                'value': request.email,
                'short': true
               
              },

              {
                'title': 'Name',
                'value': request.name,
                'short': true
               
              },
             
      
              {
                  'title': 'Area Pledge',
                  'value': request.areaPledged,
                  'short': true
                 
              },
              {
                'title': 'Type',
                'value': request.type,
                'short': true
               
            }

             
          ]
          }]
        };
      
      await axios.post(
          slackHook ,
          userAccountNotification
      );

  } catch(error){

  }

}


module.exports.areaPledgeNotification = areaPledgeNotification;
module.exports.demarcatedAreaPledgeNotification = demarcatedAreaPledgeNotification;


