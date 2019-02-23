const vcLoader = require('../src/loader');
let source = `
<template>
	<vc-select />
	<vcm-select />
	<vc-select>
		<vc-option-group>22</vc-option-group>
		<vc-option>22</vc-option>
	</vc-select>
</template>
<script>
export default {
}
</script>
`;

test('basic', () => {
	console.log(vcLoader(source));
});