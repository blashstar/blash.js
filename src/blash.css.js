!!(function (nombre, raiz, constructor) {
	if (typeof define === "function" && define.amd) {
		// AMD. Módulo anónimo
		define([], function () {
			return (root[nombre] = constructor());
		});
	}
	if (typeof exports === "object") {
		if (typeof module === "object") {
			module.exports = constructor();
		} else if (typeof exports.nodeName !== "string") {
			// CommonJS
			constructor(exports);
		} else {
			exports[nombre] = constructor();
		}
	} else {
		// Navegador
		raiz[nombre] = constructor(document);
	}
})("css", typeof self !== "undefined" ? self : this, function () {
	const ID = "blash-css";

	function generador(selector, reglas) {
		const estilo = document.getElementById(ID) || crearEstilo();
		document.head.appendChild(estilo);

		let r = [];
		for (const p in reglas) {
			r.push(`${p}:${reglas[p]}`);
		}
		const propiedades = r.join(";");

		estilo.sheet.insertRule(`${selector}{${propiedades}}`);
	}

	function crearEstilo() {
		console.log("creando ", ID);
		const estilo = document.createElement("style");
		estilo.type = "text/css";
		estilo.id = ID;
		return estilo;
	}

	return {
		agregar: generador,
		c: generador,
	};
});
