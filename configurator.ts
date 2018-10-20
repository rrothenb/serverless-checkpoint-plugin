import {platformSDK} from './sdks/platformSDK'

  import { sfdcSDK } from './sdks/sfdcSDK'
  import { generalSDK } from './sdks/generalSDK'

interface Configuration {
  sfdc: sfdcSDK,
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
  sfdc: new sfdcSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element /GYEV3ifYrAT3fbIEmw+X79mMEwW5pmw0nAzxXv2dYE='),
  dest: new generalSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element Z3XGTCIyRdmYyd9wVsYZPNOOVsgK57WqpXPq2s1tETU='),
};

  config.sfdc.toJSON = () => `() => {
  const sfdcSDK = require('./sdks/sfdcSDK');
  return new sfdcSDK.sfdcSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element /GYEV3ifYrAT3fbIEmw+X79mMEwW5pmw0nAzxXv2dYE=');
  }`;
  config.dest.toJSON = () => `() => {
  const generalSDK = require('./sdks/generalSDK');
  return new generalSDK.generalSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element Z3XGTCIyRdmYyd9wVsYZPNOOVsgK57WqpXPq2s1tETU=');
  }`;

const platform = new platformSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3');

const done = response => input[2](null, {statusCode: 200, body: JSON.stringify(response)});

return {trigger, config, platform, done}
}