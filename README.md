# coveo-components
This project extends the [Coveo Javascript Search Framework](https://github.com/coveo/search-ui) with additional components.

This project was created using the [coveo-ui-seed](https://github.com/coveo/search-ui-seed) project starter kit.

## Component Library
### Facet Reset
A button that resets a group of Facets. The group of Facets controlled by this button must be descendants of this component in the DOM. Multiple resetable facet groups may exist on a single page.
#### Options
`resetText` - Specifies the text displayed in the reset button. Default value is "Reset".

``` html
<div class="CoveoFacetReset" data-reset-text="Reset">
    <div class="CoveoFacet" />
    <div class="CoveoFacet" />
</div>
```

### Facet Slider For Range
A facet slider that queries over 2 numeric fields that represent a minimum value and a maximum value. Inherits from `Coveo.FacetSlider`.
#### Options
`minField` - Required. Specifies the field that contains the minimum boundary value of the range that the facet will query.

`maxField` - Required. Specifies the field that contains the maximum boundary value of the range that the facet will query.

``` html
<div class="CoveoFacetSliderForRange"
     data-min-field="@minPrice"
     data-max-field="@maxPrice"
     [options inherited from Coveo.FacetSlider]></div>
```

### Recent Searches
Displays a clickable list of the most recent, unique terms that were searched for in the Searhbox. Clicking on an item in the list takes the user to the search page with the selected term pre-filled. 
#### Options
`cookie` - Specifies the name of the cookie where recent search terms will be stored. Default value is "coveo-recent-searches";

`maxNumberOfTerms` - Specifies the maximum number of unique search terms to save/display. Default value is 10.

`searchPage` - Required. Specifies the search page URL.

`header` - Specifies the text to render in the component header. Default value is "Recent Searches".

#### Templates
Use an underscore template to control the html of the generates list items.
``` html
<div class="CoveoRecentSearches" data-search-page="/" data-max-number-of-terms="10" data-header="Recent Searches">
    <script class="result-template" type="text/x-underscore-template">
        <a href="<%= searchPage %>#q=<%= termUrlEncoded %>"><%= term %></a>
    </script>
</div>
```

## Contributing To This Project
The purpose of this project is to allow developers to share reusable components with other members of the Coveo community - so pull requests are welcome!

### Local Setup
To setup ths project locally, clone this repository and run the following commands:
```bash
# install yarn if you don't already have it
npm install --global yarn

# pull in node dependencies
yarn install

# build the project
npm run build

# launch a local webpack server
npm run dev

```

### Best practices for writing reusable components
* **Mark non-public properties and methods as protected instead of private**. There is no value in marking any front-end code as private, and by marking something as private you might make it more difficult for someone else to extend your component.
* **Make HTML easy to override**. My only pain-point in using Coveo has been reconciling the static HTML built to satisfy client designs with the HTML generated by Coveo components. For this reason, I believe it's worth the extra effort to make components support flexible HTML. Flexible HTML can be achieved by:
  * Keep the component's HTML footprint to a minimum. In most cases, a single `div` is enough. For example:
```html
<div class="CoveoMyCustomComponent"></div>
```
  * Utilize underscore templates in components that need to add a large volume of dynamic HTML.
  * When HTML is added in JavaScript, isolate all DOM manipulation in methods that can be easily overriden.
```html
<div class="CoveoMyCustomComponent">
  <script class="result-template" type="text/x-underscore-template">
    <div>
      dynamic HTML added by the component defined here
    </div>
  </script>
</div>
```
More information on using underscore templates in this Coveo blog post - [Reusing templates with UnderscoreJS](https://source.coveo.com/2014/10/19/reusing-templates-underscore/)

* **Do not use jQuery**. Coveo's JavaScript framework does not have a dependency on jQuery so any custom component shouldn't either.