<script lang="ts">
	export let data;
</script>

<table style="margin:auto;">
	<tr>
		<th>ORIGINAL FILE</th>
		<th>OPTIMIZED FILE</th>
		<th>TRANSFORMATION RESULT</th>
	</tr>
	{#each data.results as row}
		<tr>
			<td>{row['ORIGINAL FILE']}</td>
			<td>{row['OPTIMIZED FILE']}</td>
			<td>{row['TRANSFORMATION RESULT']}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		font-family: arial, sans-serif;
		border-collapse: collapse;
	}
	td,
	th {
		border: 1px solid #dddddd;
		text-align: left;
		padding: 8px;
	}
	tr:nth-child(even) {
		background-color: #dddddd;
	}
</style>
