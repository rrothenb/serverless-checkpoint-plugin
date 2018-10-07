"use strict";
exports.__esModule = true;
var platformSDK_1 = require("./sdks/platformSDK");
var sfdcSDK_1 = require("./sdks/sfdcSDK");
var generalSDK_1 = require("./sdks/generalSDK");
function configurator(input) {
    var body = input[0].body;
    body = typeof body === 'object' ? body : JSON.parse(body);
    var trigger = body.message;
    var config = {
        sfdc: new sfdcSDK_1.sfdcSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element /GYEV3ifYrAT3fbIEmw+X79mMEwW5pmw0nAzxXv2dYE='),
        dest: new generalSDK_1.generalSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3, Element Z3XGTCIyRdmYyd9wVsYZPNOOVsgK57WqpXPq2s1tETU=')
    };
    var platform = new platformSDK_1.platformSDK('https://staging.cloud-elements.com', 'User ohVQWLuVYoWUgm7xUOfZRMAcQyVMq8hcT9yzw3+ydkc=, Organization 1abef2a3dd1bc74f8ecf759173f0d6d3');
    var done = function (response) { return input[2](null, { statusCode: 200, body: JSON.stringify(response) }); };
    return { trigger: trigger, config: config, platform: platform, done: done };
}
exports.configurator = configurator;
