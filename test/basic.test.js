const vcLoader = require('../src/loader');
let source = `
<template>
	<vc-select />
</template>
<script>
export default {
}
</script>
`;

test('basic', () => {
	console.log(vcLoader(source));
});