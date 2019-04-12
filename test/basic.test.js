const vcLoader = require('../src/loader');
let source = `
<template>
	<vc-select />
	<vcm-select />
	<vc-table-column />
	<vc-select>
		<vc-option-group>22</vc-option-group>
		<vc-option>22</vc-option>
	</vc-select>
	<vc-transition-fade>
		// <vc-transition />
		<transition-group></transition-group>
	</vc-transition-fade>
	<vcm-form>
		<vcm-form-item :rules="{}">
			<vcm-input type="text" v-modle="value" />
		</vcm-form-item>
	</vcm-form>
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