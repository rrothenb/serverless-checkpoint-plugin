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
  const {trigger, config} = configurator(arguments);
  $checkpoint('eventReceived');
  for (let i = 0; i < trigger.events.length; i++) {
    let event = trigger.events[i];
    const myContact = await config.source.getMyContactById(event.objectId).run();
    if (myContact.Email) {
      await syncContact(myContact, config, trigger.events.length);
    }
  }
}

module.exports.eventHandler = eventHandler;
