/*******************************************************************************
 * @license
 * Copyright (c) 2013 VMware, Inc. All Rights Reserved.
 * THIS FILE IS PROVIDED UNDER THE TERMS OF THE ECLIPSE PUBLIC LICENSE
 * ("AGREEMENT"). ANY USE, REPRODUCTION OR DISTRIBUTION OF THIS FILE
 * CONSTITUTES RECIPIENTS ACCEPTANCE OF THE AGREEMENT.
 * You can obtain a current copy of the Eclipse Public License from
 * http://www.opensource.org/licenses/eclipse-1.0.php
 *
 * Contributors:
 *     Andy Clement
 ******************************************************************************/
define(function() {
	/**
	 * This function will perform checks on the configuration and where appropriate ensure options are consistent.
	 * Currently, it:
	 * 1) ensures if formatter indentation is configured, it sets editor indentation options, and vice versa
	 */
	return function processConfiguration(dotScripted) {

		// 1. Ensuring consistency of options across formatter and editor configuration
		// formatter configuration options:
		//  formatter.js.indent_size (number)
		//  formatter.js.indent_char (string)
		// editor configuration options:
		//  editor.expandtab (boolean)
		//  editor.tabsize (number)
		// rule: if possible (compatible), copy one config to the other
		var editor_expandtab_set = dotScripted.editor && (typeof dotScripted.editor.expandtab !== 'undefined');
		var editor_tabsize_set = dotScripted.editor && (typeof dotScripted.editor.tabsize !== 'undefined');
		var formatter_js_indent_size_set = dotScripted.formatter && dotScripted.formatter.js && (typeof dotScripted.formatter.js.indent_size !== 'undefined');
		var formatter_js_indent_char_set = dotScripted.formatter && dotScripted.formatter.js && (typeof dotScripted.formatter.js.indent_char !== 'undefined');

		// Just do the common cases for now:
		if (editor_expandtab_set || editor_tabsize_set) {
			if (!(formatter_js_indent_size_set || formatter_js_indent_char_set)) {
				if (editor_expandtab_set && dotScripted.editor.expandtab && !formatter_js_indent_char_set) {
					// Set the indent char to space
					if (!dotScripted.formatter) {
						dotScripted.formatter = {
							"js": {
								"indent_char": " "
							}
						};
					} else if (!dotScripted.formatter.js) {
						dotScripted.formatter.js = {
							"indent_char": " "
						};
					} else {
						dotScripted.formatter.js.indent_char = " ";
					}
				}
				if (editor_tabsize_set && !formatter_js_indent_size_set) {
					// Set the indent size to match the tabsize
					var tabsize = dotScripted.editor.tabsize;
					if (!dotScripted.formatter) {
						dotScripted.formatter = {
							"js": {
								"indent_size": tabsize
							}
						};
					} else if (!dotScripted.formatter.js) {
						dotScripted.formatter.js = {
							"indent_size": tabsize
						};
					} else {
						dotScripted.formatter.js.indent_size = tabsize;
					}
				}
			}
		} else {
			if (formatter_js_indent_size_set || formatter_js_indent_char_set) {
				var indent_char_isspace = formatter_js_indent_char_set && dotScripted.formatter.js.indent_char === " ";
				if (indent_char_isspace) {
					// Set the expandtab if we can
					if (!dotScripted.editor) {
						dotScripted.editor = {
							"expandtab": true
						};
					} else {
						dotScripted.editor.expandtab = true;
					}
				}
				if (formatter_js_indent_size_set) {
					// Set the tabsize to match the indent size
					var indentsize = dotScripted.formatter.js.indent_size;
					if (!dotScripted.editor) {
						dotScripted.editor = {
							"tabsize": indentsize
						};
					} else {
						dotScripted.editor.tabsize = indentsize;
					}
				}
			}
		}

	};
});