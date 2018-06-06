import {
    ComponentOptions,
    FacetSliderQueryController,
    IGroupByRequest,
    IComponentDefinition,
    IComponentBindings,
    IDuringQueryEventArgs,
    IQuerySuccessEventArgs,
    IFacetSliderOptions,
    IFieldOption,
    QueryBuilder,
    QueryEvents,
    Slider
} from 'coveo-search-ui';

export interface IFacetSliderForRangeOptions extends IFacetSliderOptions {
    minField?: IFieldOption;
    maxField?: IFieldOption;
};

export default function lazyFacetSliderForRange(): Promise<IComponentDefinition> {
    function extendFacetQueryController(orig: FacetSliderQueryController, minField: string, maxField: string) {
        const base = { computeOurFilterExpression: orig.computeOurFilterExpression.bind(orig) };
        orig.computeOurFilterExpression = function computeOurFilterExpression(boundary) {
            var result = base.computeOurFilterExpression(boundary);
            if (result) result += (" OR " + result.replace(minField, maxField));
            return result;
        }
    }

    return Coveo.load<IComponentDefinition>('FacetSlider').then(() => {
        class FacetSliderForRange extends Coveo.FacetSlider {
            public static ID = 'FacetSliderForRange';

            static options: IFacetSliderForRangeOptions = {
                minField: ComponentOptions.buildFieldOption({ groupByField: true, required: true, section: 'CommonOptions' }),
                maxField: ComponentOptions.buildFieldOption({ groupByField: true, required: true, section: 'CommonOptions' })
            };

            static initOptions = (options: IFacetSliderForRangeOptions) => {
                options.field = options.minField;
                return options;
            };

            constructor(public element: HTMLElement, public options: IFacetSliderForRangeOptions, bindings?: IComponentBindings, private slider?: Slider) {
                super(
                    element,
                    FacetSliderForRange.initOptions(ComponentOptions.initComponentOptions(element, FacetSliderForRange, options)),
                    bindings);

                this.bind.oneRootElement(QueryEvents.doneBuildingQuery, (args: IDuringQueryEventArgs) => this.onFirstQuery(args));
                this.bind.oneRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.onFirstQuerySuccess(args));

                // monkey patching the facetQueryController. It would have been nicer to inherit from facetQueryController and make a custom class,
                // but it's not easy to plug in a custom FacetQueryController class since Coveo initialized it in the constructor of FacetSlider
                extendFacetQueryController(this.facetQueryController, String(this.options.minField), String(this.options.maxField));
            }

            private onFirstQuery(args: IDuringQueryEventArgs) {
                args.queryBuilder.groupByRequests.push(FacetSliderForRange.getGroupByRequest(String(this.options.maxField), "maximum"));
                args.queryBuilder.groupByRequests.push(FacetSliderForRange.getGroupByRequest(String(this.options.minField), "minimum"));
            }

            private static getGroupByRequest(field: string, operation: string): IGroupByRequest {
                return {
                    completeFacetWithStandardValues: true,
                    field: field,
                    generateAutomaticRanges: true,
                    maximumNumberOfValues: 1,
                    sortCriteria: "nosort",
                    "computedFields": [{ field: field, operation: operation }]
                };
            }

            private onFirstQuerySuccess(args: IQuerySuccessEventArgs) {
                var maxFieldGroupBy = args.results.groupByResults.filter((x) => ("@" + x.field) === this.options.maxField).some((x) => {
                    if (x.globalComputedFieldResults && x.globalComputedFieldResults.length) {
                        this.options.end = x.globalComputedFieldResults[0];
                        return true;
                    }

                    return false;
                });

                var minFieldGroupBy = args.results.groupByResults.filter((x) => ("@" + x.field) === this.options.minField).some((x) => {
                    if (x.globalComputedFieldResults && x.globalComputedFieldResults.length) {
                        this.options.start = x.globalComputedFieldResults[0];
                        return true;
                    }

                    return false;
                });

                if (maxFieldGroupBy && minFieldGroupBy) {
                    super.reset();
                } else {
                    throw new Error("FacetSliderForRange.onFirstQuerySuccess: could not identify start or end value");
                }
            }
        };

        Coveo.Initialization.registerAutoCreateComponent(FacetSliderForRange);
        return FacetSliderForRange;
    });
};

Coveo.LazyInitialization.registerLazyComponent('FacetSliderForRange', lazyFacetSliderForRange);
