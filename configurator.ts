import {platformSDK} from './sdks/platformSDK'

  import { sfdcSDK } from './sdks/sfdcSDK'
  import { generalSDK } from './sdks/generalSDK'

interface Configuration {
  source: sfdcSDK,
  dest: generalSDK,
}

interface Event {
objectId: string,
date: string,
elementKey: string,
pollDate: string,
eventType: string,
hubKey: string,
objectType: string
}

interface Trigger {
events: Event[],
userId: number,
elementKey: string
accountId: number,
eventId: string,
companyId: number,
instanceId: number,
instanceName: string
}

export function configurator(input: any) : {trigger: Trigger, config: Configuration, platform: platformSDK, done: any} {
let body = input[0].body;
body = typeof body === 'object' ? body : JSON.parse(body);
const trigger = body.message;
const config = {
  source: new sfdcSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element iZnqacxCNCNSv8e2ACvXqRoHJHiO7/DAI5V2Je9Lwe4='),
  dest: new generalSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element +uWwJMvJTyeVy9AhmimkVJMgeZ7MCFqQKpe5lA8Gs9M='),
};
const platform = new platformSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3');

const done = response => input[2](null, {statusCode: 200, body: JSON.stringify(response)});

return {trigger, config, platform, done}
}