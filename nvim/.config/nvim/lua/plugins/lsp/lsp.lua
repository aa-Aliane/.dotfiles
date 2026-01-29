return {
    "neovim/nvim-lspconfig",
    event = { "BufReadPre", "BufNewFile" },
    dependencies = {
        "hrsh7th/cmp-nvim-lsp",
        { "antosha417/nvim-lsp-file-operations", config = true },
        { "folke/neodev.nvim", opts = {} },
    },
    config = function()
        local lspconfig = require("lspconfig")
        local cmp_nvim_lsp = require("cmp_nvim_lsp")
        local capabilities = cmp_nvim_lsp.default_capabilities()

        -- lua server
        lspconfig.lua_ls.setup({
            capabilities = capabilities,
            settings = {
                Lua = {
                    diagnostics = {
                        globals = { "vim" },
                    },
                    completion = {
                        callSnippet = "Replace",
                    },
                },
            },
        })

        -- marksman server for markdown files
        lspconfig.marksman.setup({
            capabilities = capabilities,
            filetypes = { "markdown" },
        })

        -- gopls server for golang
        lspconfig.gopls.setup({
            capabilities = capabilities,
            settings = {
                gopls = {
                    analyses = {
                        unusedparams = true,
                        shadow = true,
                    },
                    staticcheck = true,
                },
            },
        })

        -- tsserver for typescript and javascript
        lspconfig.ts_ls.setup({
            capabilities = capabilities,
            filetypes = { "typescript", "typescriptreact", "javascript", "javascriptreact" },
            on_attach = function(client, bufnr)
                client.server_capabilities.documentFormattingProvider = false
                client.server_capabilities.documentRangeFormattingProvider = false
            end,
        })

        -- emmet_ls for html css and js
        lspconfig.emmet_ls.setup({
            capabilities = capabilities,
            filetypes = { "html", "typescriptreact", "javascriptreact", "css", "sass", "scss", "less" },
        })

        -- nginx-language-server for nginx conf files
        lspconfig.nginx_language_server.setup({
            capabilities = capabilities,
        })

        -- prisma language server
        lspconfig.prismals.setup({
            capabilities = capabilities,
            filetypes = { "prisma" },
        })

        -- lisp language server
        lspconfig.lisp.setup({
            capabilities = capabilities,
            filetypes = { "clojure-lsp" },
        })
    end,
}
