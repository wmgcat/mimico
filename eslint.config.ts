import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: [ "**/*.{js,ts}" ],
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			"quotes": [
				"error",
				"double",
				{
					avoidEscape: false,
					allowTemplateLiterals: false
				}
			],
			"array-bracket-spacing": [
				"error",
				"always"
			],
			"object-curly-spacing": [
				"error",
				"always"
			],
			"object-curly-newline": [
				"error",
				{
					ObjectPattern: {
						minProperties: 2
					}
				}
			],
			"max-lines": [
				"error",
				{
					max: 400,
					skipBlankLines: true,
					skipComments: true
				}
			],
			"comma-dangle": [
				"error",
				"never"
			],
			"no-tabs": "off"
		}
	}
);
