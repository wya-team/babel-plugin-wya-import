<template>
	<div>
		<vc-select />
		<vc-select></vc-select>
		<vc-select></vc-select>
		<vc-form/>
		<vc-form />
		<vcm-select />
		<vcm-button>
		</vcm-button>
		<vcm-radio v-model="22">
		</vcm-radio>
	</div>
</template>
<script>
import { Test } from 'xxx'; 

export default {
	name: 'test',
	components: {
		'tpl-test': Test
	},
	data () {
		return {
			value: ''
		}
	}
}
</script>