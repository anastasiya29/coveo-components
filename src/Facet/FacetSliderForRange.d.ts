import { IComponentDefinition, IFacetSliderOptions, IFieldOption } from 'coveo-search-ui';
export interface IFacetSliderForRangeOptions extends IFacetSliderOptions {
    minField?: IFieldOption;
    maxField?: IFieldOption;
}
export default function lazyFacetSliderForRange(): Promise<IComponentDefinition>;
