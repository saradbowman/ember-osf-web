import OsfSerializer from './osf-serializer';

export default class UserSettingSerializer extends OsfSerializer {
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'user-setting': UserSettingSerializer;
    }
}
