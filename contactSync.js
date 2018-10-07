const {configurator} = require('./configurator');

async function syncContact(myContact, config, total) {
  let foundContacts = await config.dest.getByObjectName('myContact').where(`Email='${myContact.Email}'`).run();
  $checkpoint('syncingContact', total);
  if (foundContacts.length === 1) {
    await config.dest.updateObjectNameByObjectId('myContact', foundContacts[0].Id, myContact).run();
    console.log(`${foundContacts[0].Id} updated`);
  } else {
    const newContact = await config.dest.createByObjectName('myContact', myContact).run();
    console.log(`${newContact.Id} created`);
  }
}

async function eventHandler() {
  $checkpoint('eventReceived');
  const {trigger, config, done} = configurator(arguments);
  for (let event of trigger.events) {
    const myContact = await config.sfdc.getMyContactById(event.objectId).run();
    if (myContact.Email) {
      await syncContact(myContact, config, trigger.events.length);
    }
  }
  done();
}

module.exports.eventHandler = eventHandler;
