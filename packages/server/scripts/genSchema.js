// This script needs to be run in the console of an active Gimkit 2D game with Gimloader installed to work.

(function () {
	let state = GL.net.room.state;

	function generateClass(name, schema) {
		let classStr = `class ${name} extends Schema {\n`;
        let foundItem = false;

		for (let key in schema._definition.schema) {
			let value = schema._definition.schema[key];

			if (typeof value === "string") {
				// primitive type, easy
				classStr += `    @type("${value}") ${key}: ${value};\n`;
                foundItem = true;
				continue;
			}

			if (typeof value === "function") {
				// the schema is an object
				let className = key.charAt(0).toUpperCase() + key.slice(1);

				let [subClassStr, used] = generateClass(className, schema[key]);
				classStr = `${subClassStr}\n${classStr}`;

                if(used) {
                    classStr += `    @type(${className}) ${key}: ${className} = new ${className}();\n`;
                    foundItem = true;
                } else {
                    classStr += `    // @type(${className}) ${key}: ${className} = new ${className}();\n`;
                }
				continue;
			}

			if (value.map) {
				let className = `${key.charAt(0).toUpperCase() + key.slice(1)}Item`;

				let item = schema[key].getByIndex(0);
				if (!item) {
                    console.warn(`Could not find item for ${className} on ${name}`);
                    classStr += `   // @type({ map: "unknown" }) ${key} = new MapSchema<"unknown">();\n`;
					continue;
				}

				let [subClassStr, used] = generateClass(className, item);
				classStr = `${subClassStr}\n${classStr}`;

                if(used) {
                    classStr += `    @type({ map: ${className} }) ${key} = new MapSchema<${className}>();\n`;
                    foundItem = true;
                } else {
                    classStr += `    // @type({ map: ${className} }) ${key} = new MapSchema<${className}>();\n`;
                }
				continue;
			}

			if (value.array) {
				if (typeof value.array === "string") {
					classStr += `    @type([ "${value.array}" ]) ${key} = new ArraySchema<${value.array}>();\n`;
					continue;
				}

				let className = `${key.charAt(0).toUpperCase() + key.slice(1)}Item`;

				let item = schema[key].at(0);
				if (!item) {
					console.warn(`Could not find item for ${className} on ${name}`);
                    classStr += `   // @type([ "unknown" ]) ${key} = new ArraySchema<"unknown">();\n`;
					continue;
				}

				let [subClassStr, used] = generateClass(className, item);
				classStr = `${subClassStr}\n${classStr}`;

                if(used) {
                    classStr += `    @type([ ${className} ]) ${key} = new ArraySchema<${className}>();\n`;
                    foundItem = true;
                } else {
                    classStr += `    // @type([ ${className} ]) ${key} = new ArraySchema<${className}>();\n`;
                }
				continue;
			}

			console.error("Unknown type for key", key, value);
		}

		classStr += "}\n";

		return [classStr, foundItem];
	}

	window.output = generateClass("GimkitState", state)[0];
    console.log("The output has been put in window.output");
})();