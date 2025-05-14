return {
    -- mini.ai (text objects)
    {
        "echasnovski/mini.ai",
        version = false, -- Use latest version
        event = "VeryLazy", -- Load when needed
        config = function()
            require("mini.ai").setup()
        end,
    },

    -- mini.surround (surround actions)
    {
        "echasnovski/mini.surround",
        version = false,
        event = "VeryLazy",
        config = function()
            require("mini.surround").setup()
        end,
    },
    -- mini.comment (comment text)
    {
        "echasnovski/mini.comment",
        dependencies = {
            "JoosepAlviste/nvim-ts-context-commentstring",
            "nvim-treesitter/nvim-treesitter",
        },
        opts = function()
            -- Configure treesitter context commentstring first
            require("ts_context_commentstring").setup({
                enable_autocmd = false, -- Let mini.comment handle the commenting
                languages = {
                    javascript = { __default = "// %s", __multiline = "/* %s */" },
                    typescript = { __default = "// %s", __multiline = "/* %s */" },
                    javascriptreact = {
                        __default = "// %s",
                        __multiline = "/* %s */",
                        jsx_element = "{/* %s */}",
                        jsx_fragment = "{/* %s */}",
                        jsx_attribute = "// %s",
                        comment = "// %s",
                    },
                    typescriptreact = {
                        __default = "// %s",
                        __multiline = "/* %s */",
                        jsx_element = "{/* %s */}",
                        jsx_fragment = "{/* %s */}",
                        jsx_attribute = "// %s",
                        comment = "// %s",
                    },
                },
            })

            -- Then configure mini.comment
            return {
                options = {
                    custom_commentstring = function()
                        local filetype = vim.bo.filetype
                        -- Handle JSX/TSX specifically
                        if filetype == "typescriptreact" or filetype == "javascriptreact" then
                            local cstring = require("ts_context_commentstring.internal").calculate_commentstring()
                            return cstring or "{/* %s */}" -- Fallback for JSX
                        end
                        return require("ts_context_commentstring.internal").calculate_commentstring()
                    end,
                },
                mappings = {
                    -- Toggle comment (like `gcc`)
                    comment = "gc",
                    -- Toggle comment on textobject (like `gcip`)
                    comment_line = "gc",
                    -- Define comment textobject (not mapped by default)
                    textobject = "gc",
                },
            }
        end,
        config = function(_, opts)
            require("mini.comment").setup(opts)
        end,
    },
}
