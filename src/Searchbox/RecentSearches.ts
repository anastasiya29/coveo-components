import {
    $$,
    ComponentOptions,
    Cookie,
    Component,
    IComponentBindings,
    IDuringQueryEventArgs,
    Initialization,
    QueryEvents
} from 'coveo-search-ui';
import * as _ from 'underscore';

export interface IRecentSearchesOptions {
    cookie: string;
    maxNumberOfTerms: number;
    searchPage: string;
    header: string;
}

export class RecentSearches extends Component {
    static ID = 'RecentSearches';
    protected template: any;
    protected listElement: HTMLElement;
    protected noTermsElement: HTMLElement;
    protected terms: string[] = [];

    static options: IRecentSearchesOptions = {
        cookie: ComponentOptions.buildStringOption({ defaultValue: 'coveo-recent-searches' }),
        maxNumberOfTerms: ComponentOptions.buildNumberOption({ defaultValue: 10 }),
        searchPage: ComponentOptions.buildStringOption({ required: true }),
        header: ComponentOptions.buildStringOption({ defaultValue: 'Recent Searches' })
    };

    constructor(public element: HTMLElement, public options: IRecentSearchesOptions, public bindings: IComponentBindings) {
        super(element, RecentSearches.ID, bindings);
        ComponentOptions.initComponentOptions(element, RecentSearches, options);

        this.template = _.template(this.element.querySelector('script.result-template').innerHTML);
        this.buildDom();
        this.readTermsFromCookie(options.cookie);
        this.renderDom();
        this.renderNoTermsMessage();

        this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDuringQueryEventArgs) => this.onDoneBuildingQuery(args));
    }

    public addSearchTerm(term: string) {
        if (!term || !term.length) {
            return;
        }

        term = term.trim();
        const existing = this.terms.indexOf(term);

        if (existing > -1) {
            this.terms.splice(existing, 1);
        }

        if (this.terms.length === this.options.maxNumberOfTerms) {
            this.terms.pop();
        }

        this.terms.unshift(term);
        Cookie.set(this.options.cookie, JSON.stringify(this.terms));
        this.resetDom();
        this.renderDom();
    }

    public onDoneBuildingQuery(args: IDuringQueryEventArgs) {
        const parts = args.queryBuilder.expression.getParts();
        if (parts.length) {
            this.addSearchTerm(parts[0]);
        }
    }

    protected buildDom() {
        const headerElement = document.createElement('div');
        headerElement.classList.add('coveo-recent-searches-header');
        headerElement.textContent = this.options.header;
        this.element.appendChild(headerElement);

        this.listElement = document.createElement('ul');
        this.listElement.classList.add('coveo-recent-searches-list');
        this.element.appendChild(this.listElement);

        this.noTermsElement = document.createElement('div');
        this.noTermsElement.classList.add('coveo-recent-searches-no-terms-message');
        this.element.appendChild(this.noTermsElement);
    }

    protected readTermsFromCookie(cookie: string) {
        const termsFromCookies = Cookie.get(cookie);
        this.terms = termsFromCookies ? JSON.parse(termsFromCookies) : [];
    }

    protected renderNoTermsMessage() {
        const display = this.terms.length > 0 ? 'none' : 'block';
        this.noTermsElement.style.display = display;
    }

    protected resetDom() {
        this.listElement.innerHTML = '';
    }

    protected renderDom() {
        this.terms.forEach((term) => {
            const li = document.createElement('li');
            li.innerHTML = this.template({
                searchPage: this.options.searchPage,
                termUrlEncoded: encodeURIComponent(term),
                term: term
            });

            this.listElement.appendChild(li);
        });
    }
}

Initialization.registerAutoCreateComponent(RecentSearches);
