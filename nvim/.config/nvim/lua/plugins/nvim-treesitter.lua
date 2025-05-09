return {
    {
        "nvim-treesitter/nvim-treesitter",
        build = ":TSUpdate",
        config = function()
            require("nvim-treesitter.configs").setup({
                -- Add 'typescript' and 'tsx' (if needed)
                ensure_installed = {
                    "typescript",
                    "tsx",
                    "javascript",
                    "lua",
                    "vim",
                    "vimdoc",
                    "python",
                },
                sync_install = false,
                auto_install = true,

                highlight = {
                    enable = true,
                    additional_vim_regex_highlighting = false,
                },

                -- Optional: Better navigation, refactoring, and code actions
                incremental_selection = { enable = true },
                indent = { enable = true },
                textobjects = { enable = true },
            })
        end,
    },
}
