import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import Session from 'ember-simple-auth/services/session';
import styles from './styles';
import template from './template';

const osfURL = config.OSF.url;

export enum OSFService {
    HOME = 'HOME',
    PREPRINTS = 'PREPRINTS',
    REGISTRIES = 'REGISTRIES',
    MEETINGS = 'MEETINGS',
    INSTITUTIONS = 'INSTITUTIONS',
}

interface ServiceLink {
    name: string;
    route?: string;
    href?: string;
}

export const OSF_SERVICES: ServiceLink[] = [
    { name: OSFService.HOME, route: 'home' },
    { name: OSFService.PREPRINTS, href: `${osfURL}preprints/` },
    { name: OSFService.REGISTRIES, route: 'registries' },
    { name: OSFService.MEETINGS, href: `${osfURL}meetings/` },
    { name: OSFService.INSTITUTIONS, route: 'institutions' },
];

@layout(template, styles)
export default class OsfNavbar extends Component {
    @service analytics!: Analytics;
    @service features!: Features;
    @service router!: any;
    @service session!: Session;

    showNavLinks: boolean = false;

    activeService: OSFService = defaultTo(this.activeService, OSFService.HOME);
    services: ServiceLink[] = defaultTo(this.services, OSF_SERVICES);

    @computed('activeService', 'router.currentRouteName')
    get _activeService() {
        let { activeService } = this;

        // HACK/Special case until institutions are put into an engine
        if (activeService === OSFService.HOME && this.router.currentRouteName === 'institutions') {
            activeService = OSFService.INSTITUTIONS;
        }

        return this.services.find(x => x.name === activeService);
    }

    @action
    onClickPrimaryDropdown(this: OsfNavbar) {
        this.set('showNavLinks', false);
        this.analytics.click('button', 'Navbar - Dropdown Arrow');
    }

    @action
    toggleSecondaryNavigation() {
        this.toggleProperty('showNavLinks');
    }

    @action
    onLinkClicked() {
        this.set('showNavLinks', false);
    }
}
