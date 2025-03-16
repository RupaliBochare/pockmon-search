# Test assignment - Pokemon search

You are given a several components and api endpoints to work with.

Those components are:
- `Navigation` - a component that renders a list of links in header
- `Search` - a component that renders a search form with autosuggest
- `Results` - a component that renders a table with data from the api
- `Paginator` - a component that renders a pagination for the table

The api endpoints are:
- `GET https://pokeapi.co/api/v2/pokemon?limit=100` - returns a list of pokemons, will be used by `Search` compoenent to render autosuggest dropdown
- `GET https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters` - returns a list of locations where the pokemon can be found, will be used by `Results` component to render the table

Your task is to implement the following:
- Project requirements: Create a project using `create-react-app`, `nextjs` or any other boilerplate you like. We've tested the components using `nextjs`, hence the 'use client' directive at the top of the code.
  - Be sure to use typescript.
  - Use `tailwindcss` for styling.
  - Make sure you have a robust folder structure for future scaling of the project. Be prepared to explain your choices.
- Routing requirements: Create two route paths using any router of choice and add the provided components to the project. 
  - Each page is supposed to show `Navigation` component at the top.
  - The first page should have `Search` component and the second page should have `Results` and `Paginator` components. 
  - When a pokemon is selected from the dropdown or search button clicked, the user should be redirected to the second page with the results of where the selected pokemon can be found (encounters).
  - Returning back to the first page should keep the search query in the input field.
  - Returning back to the result page should keep the search results and pagination state, the table can rerender though.
  - Same on page refresh.
- Extend the components: 
  - `Navigation` component should be flexible and push the page links into a dropdown menu [...] one by one when the screen real estate is too small to fit all the links.
  - `Results` component should not request the data from the api on every pagination interaction. Instead, it should request it only when the new search is executed.
  - `Paginator` component should be able to handle the pagination of the data on the client side.

During our review, we will be looking for:
- Code quality and structure
- Strong typing
- Your ability to explain your choices live at 2nd stage interview

Send us the folder structure of your created workspace without node_modules folder.
Good luck!