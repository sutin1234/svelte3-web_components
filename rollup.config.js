import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import path from "path";
import multiInput from "rollup-plugin-multi-input";
import fs from "fs";

const production = !process.env.ROLLUP_WATCH;
const web = process.env.NODE_ENV == "web_components";
let basePath = path.join(__dirname, "./src/web_components");

const getAllFiles = (dir) =>
	fs.readdirSync(dir).reduce((files, file) => {
		const name = path.join(dir, file);
		const isDirectory = fs.statSync(name).isDirectory();
		return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
	}, []);
const srcFiles = getAllFiles(basePath);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn(
				"npm",
				["run", "start", "--", "--dev"],
				{
					stdio: ["ignore", "inherit", "inherit"],
					shell: true,
				}
			);

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default {
	input: !web ? "src/main.js" : srcFiles,
	output: !web
		? {
			sourcemap: true,
			format: "iife",
			name: "bundle",
			dir: "public/build",
		}
		: {
			format: "es",
			dir: "public/build",
		},
	plugins: [
		svelte({
			compilerOptions: {
				customElement: web ? true : false,
				dev: !production,
			},
		}),
		css({ output: "bundle.css" }),
		resolve({
			browser: true,
			dedupe: ["svelte"],
		}),
		commonjs(),
		!production && serve(),
		!production && livereload("public"),
		production && terser(),
		multiInput({
			relative: "src/",
			transformOutputPath: (output, input) => {
				return output;
			},
		}),
	],
	watch: {
		clearScreen: false,
	},
};
