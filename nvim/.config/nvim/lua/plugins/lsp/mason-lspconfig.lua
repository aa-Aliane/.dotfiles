return {

    "williamboman/mason-lspconfig.nvim",
    dependencies = {
        "WhoIsSethDaniel/mason-tool-installer.nvim",
    },
    config = function()
        local mason_lspconfig = require("mason-lspconfig")
        local mason_tool_installer = require("mason-tool-installer")
        mason_lspconfig.setup({
            ensure_installed = {
                "html",
                "cssls",
                "tailwindcss",
                "lua_ls",
                "graphql",
                "emmet_ls",
                "prismals",
                "pyright",
                "gopls",
                "marksman",
                "ts_ls",
            },
        })
        mason_tool_installer.setup({
            ensure_installed = {
                "prettier",
                "stylua",
                "isort",
                "black",
                "pylint",
                "eslint_d",
                "goimports",
            },
        })
    end,
}
