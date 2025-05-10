return {
    "epwalsh/obsidian.nvim",
    version = "*", -- recommended, use latest release instead of latest commit
    lazy = false,
    ft = "markdown",
    dependencies = {
        -- Required.
        "nvim-lua/plenary.nvim",
        "nvim-telescope/telescope.nvim",
        -- see below for full list of optional dependencies 👇
    },
    opts = {
        workspaces = {
            {
                name = "aa-Aliane",
                path = "~/vaults/aa-Aliane/",
            },
        },
        -- New configuration added below
        notes_subdir = "Inbox", -- This will make new notes go to the Inbox folder
        new_notes_location = "notes_subdir", -- This specifies to use the notes_subdir for new notes

        -- Optional: If you want daily notes to go to the daily folder
        daily_notes = {
            folder = "Journal",
            date_format = "%Y-%m-%d",
            alias_format = "%B %-d, %Y",
        },
        note_frontmatter_func = function(note)
            local path = tostring(note.path or "")
            local is_daily_note = path:match("Journal/") ~= nil

            return {
                id = note.id,
                title = note.title,
                aliases = note.aliases,
                tags = is_daily_note and { "journal" } or note.tags,
                date = is_daily_note and os.date("%Y-%m-%d") or nil,
            }
        end,
    },
    config = function(_, opts)
        require("obsidian").setup(opts)

        -- Set keymaps
        vim.keymap.set("n", "<leader>on", ":ObsidianNew<CR>", { desc = "Obsidian: New Note" })
        vim.keymap.set("n", "<leader>oo", ":ObsidianOpen<CR>", { desc = "Obsidian: Open Vault" })
        vim.keymap.set("n", "<leader>os", ":ObsidianSearch<CR>", { desc = "Obsidian: Search Notes" })
        vim.keymap.set("n", "<leader>ot", ":ObsidianToday<CR>", { desc = "Obsidian: Today's Note" })
    end,
}
