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
		raiz[nombre] = constructor();
	}
})("html", typeof self !== "undefined" ? self : this, function () {
	function generador(nodo = "", contenido, atributos, eventos) {
		const dom = raiz.document;
		let cadena = nodo ?? "";

		// Etiqueta
		const rEtiqueta = /(?<etiqueta>^[a-z1-6-]+)/i;
		const etiqueta = cadena.match(rEtiqueta)?.groups?.etiqueta ?? "div";
		cadena = cadena.replace(etiqueta, "");
		const elemento = dom.createElement(etiqueta);

		// Texto
		const rTexto = /\{(?<texto>(.+?))\}/;
		const texto = cadena.match(rTexto)?.groups?.texto ?? "";
		cadena = cadena.replace(`{${texto}}`, "");
		elemento.appendChild(dom.createTextNode(texto));

		// Atributos
		const rAtributos = /\[(?<atributos>(.+?))\]/;
		const _atributos = cadena.match(rAtributos)?.groups?.atributos ?? "";
		cadena = cadena.replace(`[${_atributos}]`, "");
		_atributos
			.split(",")
			.filter((item) => item)
			.forEach((item) => {
				const datos = item.trim().split("=");
				elemento.setAttribute(
					datos[0]?.trim() ?? "",
					datos[1]?.trim() ?? ""
				);
			});

		// Id
		const rId = /#(?<id>[_a-z0-9-]+)/i;
		const id = cadena.match(rId)?.groups?.id;
		cadena = cadena.replace(`#${id}`, "");
		id && (elemento.id = id);

		// Clases
		const rClases = /(?<clases>(\.[_a-z0-9-:]+)+)/i;
		const clases = cadena.match(rClases)?.groups?.clases;
		if (clases) {
			elemento.classList.add(...clases.split(".").filter((item) => item));
		}

		if (contenido) {
			if (contenido instanceof HTMLElement) {
				elemento.appendChild(contenido);
			} else if (Array.isArray(contenido)) {
				contenido.forEach(function (e) {
					elemento.appendChild(e);
				});
			} else {
				elemento.appendChild(dom.createTextNode(contenido));
			}
		}

		if (atributos) {
			for (p in atributos) {
				elemento.setAttribute(p, atributos[p]);
			}
		}

		if (eventos) {
			for (p in eventos) {
				elemento.addEventListener(p, eventos[p]);
			}
		}

		return elemento;
	}

	return {
		h: generador,
	};
});
