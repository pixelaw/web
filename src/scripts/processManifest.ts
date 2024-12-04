
function resolveType(originalType: string): string {
    if (originalType === 'core::felt252') return 'string';
    else if (originalType.includes('core::integer')) return 'number';
    else if (originalType.includes('core::starknet::contract_address::ContractAddress')) return 'string';
    return originalType;
}

function resolveItemName(name: string): string {
    return name.split('::').pop() || name;
}
export function generateTypescriptDefinitions(json: any): string {
    let tsCode = '';

    json.abi.forEach((item: any) => {
        if (!item.name.startsWith("pixelaw::")) return;

        item.name = resolveItemName(item.name)
        if (item.type === 'struct') {
            tsCode += `interface ${item.name} {\n`;
            item.members.forEach((member: any) => {
                const type = resolveType(member.type);
                tsCode += `  ${member.name}: ${type};\n`;
            });
            tsCode += '}\n\n';
        } else if (item.type === 'interface') {
            tsCode += `interface ${item.name} {\n`;
            item.items.forEach((func: any) => {
                let inputs = func.inputs.map((input: any) => {
                    const type = resolveType(input.type);
                    return `${input.name}: ${type}`;
                }).join(', ');
                let outputs = func.outputs.map((output: any) => {
                    const type = resolveType(output.type);
                    return type;
                }).join(', ');
                if (func.outputs.length > 1) outputs = `[${outputs}]`;
                tsCode += `  ${func.name}(${inputs}): ${outputs.length > 0 ? outputs : 'void'};\n`;
            });
            tsCode += '}\n\n';
        } else if (item.type === 'enum') {
            tsCode += `enum ${item.name} {\n`;
            item.variants.forEach((variant: any) => {
                tsCode += `  ${variant.name} = "${variant.type}",\n`;
            });
            tsCode = tsCode.slice(0, -2) + '\n}\n\n'; // Remove last comma and add closing bracket
        }
    });

    return tsCode;
}
