vim.cmd("let g:netrw_liststyle = 3")

local opt = vim.opt

opt.relativenumber = true
opt.number = true

-- tabs & indentation
opt.tabstop = 2 -- 2 spaces for tabs (prettier default)
opt.shiftwidth = 2 -- 2 spaces for indent width
opt.expandtab = true -- expand tab to spaces
opt.autoindent = true -- copy indent from current line when starting new one

opt.wrap = false

-- search settings
opt.ignorecase = true -- ignore case when searching
opt.smartcase = true -- if you include mixed case in your search, assumes you want case-sensitive

opt.cursorline = true

-- turn on termguicolors for tokyonight colorscheme to work
-- (have to use iterm2 or any other true color terminal)
opt.termguicolors = true
opt.background = "dark" -- colorschemes that can be light or dark will be made dark
opt.signcolumn = "yes" -- show sign column so that text doesn't shift

-- backspace
opt.backspace = "indent,eol,start" -- allow backspace on indent, end of line or insert mode start position

-- clipboard
opt.clipboard:append("unnamedplus") -- use system clipboard as default register

-- split windows
opt.splitright = true -- split vertical window to the right
opt.splitbelow = true -- split horizontal window to the bottom

-- Wait until Catppuccin is loaded to access its colors
vim.api.nvim_create_autocmd("User", {
    pattern = "CatppuccinLoaded",
    callback = function()
        local cp = require("catppuccin")
        local colors = cp.get_palette()
        -- Alternative if the above doesn't work:
        -- local colors = require("catppuccin.api.colors").get_palette()

        -- Highlight WinBar groups using Catppuccin colors
        vim.cmd(string.format([[highlight WinBar1 guifg=%s]], colors.text))
        vim.cmd(string.format([[highlight WinBar2 guifg=%s]], colors.subtext1))
        vim.cmd(string.format([[highlight WinBar3 guifg=%s gui=bold]], colors.mauve))

        -- Function to get the full path and replace the home directory with ~
        local function get_winbar_path()
            local full_path = vim.fn.expand("%:p:h")
            return full_path:gsub(vim.fn.expand("$HOME"), "~")
        end

        -- Function to get the number of open buffers using the :ls command
        local function get_buffer_count()
            return vim.fn.len(vim.fn.getbufinfo({ buflisted = 1 }))
        end

        -- Function to update the winbar
        local function update_winbar()
            local home_replaced = get_winbar_path()
            local buffer_count = get_buffer_count()
            vim.opt.winbar = "%#WinBar1#%m "
                .. "%#WinBar2#("
                .. buffer_count
                .. ") "
                -- this shows the filename on the left
                .. "%#WinBar3#"
                .. vim.fn.expand("%:t")
                -- This shows the file path on the right
                .. "%*%=%#WinBar1#"
                .. home_replaced
        end

        -- Winbar was not being updated after I left lazygit
        vim.api.nvim_create_autocmd({ "BufEnter", "ModeChanged" }, {
            callback = function(args)
                local old_mode = args.event == "ModeChanged" and vim.v.event.old_mode or ""
                local new_mode = args.event == "ModeChanged" and vim.v.event.new_mode or ""
                -- Only update if ModeChanged is relevant (e.g., leaving LazyGit)
                if args.event == "ModeChanged" then
                    -- Get buffer filetype
                    local buf_ft = vim.bo.filetype
                    -- Only update when leaving `snacks_terminal` (LazyGit)
                    if buf_ft == "snacks_terminal" or old_mode:match("^t") or new_mode:match("^n") then
                        update_winbar()
                    end
                else
                    update_winbar()
                end
            end,
        })

        -- Initial update
        update_winbar()
    end,
})

-- turn off swapfile
