<script>
	import { Router, Link } from 'svelte-routing'
	export let url="";
</script>

<main>
	<Router url="{url}">
 <nav>
    <Link to="/">Home</Link>
    <Link to="about">About</Link>
  </nav>
  <div>
    <!-- <Route path="about" component="{About}" /> 
    for now the router just support case sensitive,
        one workaround colud be add two time the route
        Example.
       <Route path="About" component="{About}" /> 
    <Route path="/"><Home /></Route> -->
  </div>
</Router>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>