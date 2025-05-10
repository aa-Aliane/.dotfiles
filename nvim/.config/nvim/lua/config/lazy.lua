-- lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
    local lazyrepo = "https://github.com/folke/lazy.nvim.git"
    local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
    if vim.v.shell_error ~= 0 then
        vim.api.nvim_echo({
            { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
            { out, "WarningMsg" },
            { "\nPress any key to exit..." },
        }, true, {})
        vim.fn.getchar()
        os.exit(1)
    end
end
vim.opt.rtp:prepend(lazypath)

vim.g.mapleader = " "
vim.g.maplocalleader = "\\"

vim.keymap.set("n", "<C-h>", ":bprevious<CR>", { desc = "Previous buffer" })
vim.keymap.set("n", "<C-l>", ":bnext<CR>", { desc = "Next buffer" })

vim.api.nvim_set_hl(0, "LineNr", { fg = "#888888" }) -- Absolute line number color
vim.api.nvim_set_hl(0, "CursorLineNr", { fg = "#FFFFFF" }) -- Current line number color
vim.api.nvim_set_hl(0, "LineNrAbove", { fg = "#666666" }) -- Relative line numbers above
vim.api.nvim_set_hl(0, "LineNrBelow", { fg = "#666666" }) -- Relative line numbers below


-- Setup lazy.nvim
require("lazy").setup({
    spec = {
        { import = "plugins" },
        { import = "plugins.lsp" },
    },
    --install = { colorscheme = { "habamax" } },
    checker = { enabled = true },
})
