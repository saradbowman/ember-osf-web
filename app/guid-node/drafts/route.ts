import Route from '@ember/routing/route';

export default class GuidNodeDrafts extends Route {
    model(params: { draftId: string }) {
        this.transitionTo('registries.drafts.draft-shim', params.draftId);
    }
}