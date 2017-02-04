// var st = "Августиновичи: Иванъ, сынъ Ивана, внукъ Антона Іосифова-Васильева съ сыномъ Францемъ-Карломъ.";
// 'Акаѣвичи: Францъ, Михаилъ съ сыновьями: Николаемъ-Гоноратомъ и Казиміромъ; Матвѣй съ сыновьями: Адамомъ и Валеріаномъ, сыновья Іосифа Николаева; Николай, сынъ Казиміра Михаилова.'
function parser(st) {
	var level = 0,
		prev,
		nodes = [],
		edges = [],
		famaly = '',
		arr = st.split(' ');

	if(arr[0][arr[0].length - 1] === ':') { famaly = arr.shift(); }
	arr.forEach(function(it, i) {
		var flag = true,
			node;
		if (it === 'сынъ' || it === 'внукъ') { level++; flag = false; node = prev; }
		else if (it === 'съ') { flag = false; }
		else if (it === 'сыномъ') { level = -1; flag = false; node = nodes[0]; }
		
		if (flag) {
			node = {
			  id: i,
			  label: it.replace(/,/, ''),
			  level: level
			};
			nodes.push(node);
			if (prev) {
				edges.push({
				  from: prev.id,
				  to: node.id
				});
			}
		}
		prev = node;
	});
	return {nodes: nodes, edges: edges, famaly: famaly};
}
module.exports = parser;
