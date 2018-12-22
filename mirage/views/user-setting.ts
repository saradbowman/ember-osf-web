import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

export function updateUserSetting(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs('userSetting');
    const userId = request.params.parentID;
    const userSettings = schema.userSettings.findBy({ userId });
    const { twoFactorEnabled, twoFactorConfirmed } = userSettings;
    let { secret } = userSettings;

    if (attrs.twoFactorEnabled === false) {
        secret = '';
    }

    let confirmTwoFactor = twoFactorConfirmed && twoFactorEnabled;
    if (attrs.verification !== undefined) {
        if (attrs.verification === 123456) {
            if (twoFactorEnabled === true) {
                confirmTwoFactor = true;
            }
        } else {
            return new Response(403, { 'Content-Type': 'application/vnd.api+json' }, {
                errors: [{
                    status: 403,
                    detail: 'The two-factor verification code you provided is invalid.',
                }],
            });
        }
    }
    if (attrs.twoFactorEnabled && !twoFactorEnabled && !confirmTwoFactor) {
        secret = 'S3CR3TSHH';
    }

    const userSetting = userSettings.update({
        ...attrs,
        secret,
        twoFactorConfirmed: confirmTwoFactor,
        verification: '',
    });
    return userSetting;
}

export function getUserSetting(this: HandlerContext, schema: Schema, request: Request) {
    const userSetting = schema.userSettings.findBy({ userId: request.params.id });
    const response = this.serialize(userSetting, 'user-setting');
    return response;
}
