local wezterm = require("wezterm")
return {
	font = wezterm.font("FiraCode Nerd Font"),
	font_size = 12.0,
	harfbuzz_features = { "calt=1", "clig=1", "liga=1" },
	color_scheme = "Catppuccin Mocha", -- or Macchiato, Frappe, Latte
}
