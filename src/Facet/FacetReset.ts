import {
	Component,
	ComponentOptions,
	IComponentBindings,
	Initialization,
	InitializationEvents
} from 'coveo-search-ui';
import * as $ from 'jquery';

export interface IFacetResetOptions {
	resetText: string;
}

export class FacetReset extends Component {
	static ID = 'FacetReset';
	private facets: Coveo.Facet[];
	private resetButton: HTMLElement;

	static options: IFacetResetOptions = {
		resetText: ComponentOptions.buildStringOption({required: true})
	};

	constructor(public element: HTMLElement, public options: IFacetResetOptions, public bindings: IComponentBindings) {
		super(element, FacetReset.ID, bindings);
		ComponentOptions.initComponentOptions(element, FacetReset, options)
		this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => this.onDoneLoading());
		this.resetButton = this.createResetButton(options.resetText);
	}

	protected createResetButton(text: string): HTMLElement {
		const element = document.createElement("button");
		element.classList.add("coveo-facet-reset-button");
		element.setAttribute("type", "button");
		element.textContent = text;
		return element;
	}

	protected onDoneLoading() {
		const facets = [];
		$(this.element).find("[class^=CoveoFacet]").each(function() {
			facets.push(Coveo.get(this) as Coveo.Facet);
		});

		this.facets = facets;
		this.resetButton.addEventListener("click", this.onClick.bind(this));
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
