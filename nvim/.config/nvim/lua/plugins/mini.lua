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
}
