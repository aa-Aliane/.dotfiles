-- In your lua/plugins/ufo.lua file (or wherever you organize your plugins)
return {
    "kevinhwang91/nvim-ufo",
    dependencies = {
        "kevinhwang91/promise-async",
        "nvim-treesitter/nvim-treesitter",
    },
    event = "BufReadPost", -- Load when a file is opened
    keys = {
        -- Add keymappings
        {
            "zR",
            function()
                require("ufo").openAllFolds()
            end,
            desc = "Open all folds",
        },
        {
            "zM",
            function()
                require("ufo").closeAllFolds()
            end,
            desc = "Close all folds",
        },
        {
            "zr",
            function()
                require("ufo").openFoldsExceptKinds()
            end,
            desc = "Open folds except kinds",
        },
        {
            "zm",
            function()
                require("ufo").closeFoldsWith()
            end,
            desc = "Close folds with",
        },
        {
            "zp",
            function()
                require("ufo").peekFoldedLinesUnderCursor()
            end,
            desc = "Peek folded lines",
        },
    },
    opts = {
        provider_selector = function(bufnr, filetype, buftype)
            -- You can specify providers based on filetype or return a specific provider
            return { "treesitter", "indent" }
        end,
        -- Optional: close folds automatically when moving out
        close_fold_kinds_for_ft = {
            default = { "imports", "comment" },
            json = { "array" },
            yaml = { "block_mapping" },
        },
        -- Optional: fold level customization
        fold_virt_text_handler = function(virtText, lnum, endLnum, width, truncate)
            -- Customize the appearance of folded text
            return virtText
        end,
    },
    config = function(_, opts)
        -- Set fold-related options
        vim.o.foldcolumn = "1" -- '0' is also a valid option
        vim.o.foldlevel = 99
        vim.o.foldlevelstart = 99
        vim.o.foldenable = true

        require("ufo").setup(opts)
    end,
}
