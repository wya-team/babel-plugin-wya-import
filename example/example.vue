<template>
	<vc-select />
	<vcm-select />
	<vcm-input-number />
	<vcm-table />
	<vcm-table-column />
	<vc-table-column />
	<vc-table-item />
	<vcm-form />
	<vcm-form-item />
	<vcm-marquee />
	<vc-marquee />
	<vc-form />
	<vc-form-item />
	<vc-select>
		<vc-option-group>22</vc-option-group>
		<vc-option>22</vc-option>
	</vc-select>
	<vc-transition-fade>
		// <vc-transition />
		<transition-group></transition-group>
	</vc-transition-fade>
	<vc-steps-bar />
	<vc-steps>
		<vc-step></vc-step>
	</vc-steps>
</template>
<script>
import { MTable, Select, Portal } from '@wya/vc';
import Table from '@wya/vc/lib/table';

export const config = {
	components: {
		'vc-select': Select
	}
}
</script>