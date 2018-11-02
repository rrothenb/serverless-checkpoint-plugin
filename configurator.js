"use strict";
exports.__esModule = true;
var platformSDK_1 = require("./sdks/platformSDK");
var sfdcSDK_1 = require("./sdks/sfdcSDK");
var generalSDK_1 = require("./sdks/generalSDK");
var checkpointer = require("./serverlessCheckpointer")
function configurator(input) {
    var body = input[0].body;
    body = typeof body === 'object' ? body : JSON.parse(body);
    var trigger = body.message;
    var config = {
        source: new sfdcSDK_1.sfdcSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element iZnqacxCNCNSv8e2ACvXqRoHJHiO7/DAI5V2Je9Lwe4='),
        dest: new generalSDK_1.generalSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element +uWwJMvJTyeVy9AhmimkVJMgeZ7MCFqQKpe5lA8Gs9M=')
    };
  checkpointer.register(sfdcSDK_1.sfdcSDK, obj => new sfdcSDK_1.sfdcSDK(obj.domain.replace('/elements/api-v2', ''), obj.authorizationHeader))
  checkpointer.register(generalSDK_1.generalSDK, obj => new generalSDK_1.generalSDK(obj.domain.replace('/elements/api-v2', ''), obj.authorizationHeader))
    var platform = new platformSDK_1.platformSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3');
    var done = function (response) { return input[2](null, { statusCode: 200, body: JSON.stringify(response) }); };
    return { trigger: trigger, config: config, platform: platform, done: done };
}
exports.configurator = configurator;
