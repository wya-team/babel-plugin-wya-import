# vc-loader

```js
module: {
	rules: [
		{
			test: /\.vue$/,
			use: [
				{
					loader: 'vue-loader',
					options: {
						
					}
				},
				{
					loader: 'vc-loader'
				}
			]
		}
	]
}
```
