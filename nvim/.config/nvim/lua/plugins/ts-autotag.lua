return {
    {
        "windwp/nvim-ts-autotag",
        dependencies = { "nvim-treesitter/nvim-treesitter" },
        ft = { "html", "javascriptreact", "typescriptreact" }, -- Optional lazy loading
        opts = {
            enable_close = true,
            enable_rename = true,
            enable_close_on_slash = false,
            filetypes = {
                "html",
                "javascript",
                "typescript",
                "javascriptreact",
                "typescriptreact",
            },
        },
    },
}
