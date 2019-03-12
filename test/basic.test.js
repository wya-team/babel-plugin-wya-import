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
import { Select } from '@wya/vc';

export default {
	components: {
		'vc-select': Select
	}
}
</script>
`;

test('basic', () => {
	console.log(vcLoader(source));
});