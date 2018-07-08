import {
	Component,
	ComponentOptions,
	IComponentBindings,
	Initialization,
	InitializationEvents
} from 'coveo-search-ui';

export interface IFacetResetOptions {
	resetText: string;
}

export class FacetReset extends Component {
	static ID = 'FacetReset';
	private facets: Coveo.Facet[];
	private resetButton: HTMLElement;

	static options: IFacetResetOptions = {
		resetText: ComponentOptions.buildStringOption({ defaultValue: 'Reset' })
	};

	constructor(public element: HTMLElement, public options: IFacetResetOptions, public bindings: IComponentBindings) {
		super(element, FacetReset.ID, bindings);
		ComponentOptions.initComponentOptions(element, FacetReset, options);
		this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => this.onAfterComponentsInitialization());
		this.resetButton = this.createResetButton(options.resetText);
	}

	protected createResetButton(text: string): HTMLElement {
		const element = document.createElement('button');
		element.classList.add('coveo-facet-reset-button');
		element.setAttribute('type', 'button');
		element.textContent = text;
		return element;
	}

	protected onAfterComponentsInitialization() {
		const facets = [], facetElements = this.element.querySelectorAll('[class^=CoveoFacet]');
		Array.prototype.slice.call(facetElements).forEach((facet) => facets.push(Coveo.get(facet) as Coveo.Facet));
		this.facets = facets;
		this.resetButton.addEventListener('click', this.onClick.bind(this));
		this.element.appendChild(this.resetButton);
	}

	protected onClick(ev) {
		ev.preventDefault();
		this.resetFacets();
		return false;
	}

	protected resetFacets() {
		this.facets.forEach((facet) => facet.reset());
		Coveo.executeQuery(this.root);
	}
}

Initialization.registerAutoCreateComponent(FacetReset);
