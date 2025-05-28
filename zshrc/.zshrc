
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="agnoster"



plugins=(git zsh-autosuggestions)


source $ZSH/oh-my-zsh.sh

export PATH="$PATH:/opt/nvim-linux-x86_64/bin"



alias vim="nvim"
alias v="nvim"
alias t="tmux"
alias y="yazi"

alias dc="docker compose"
alias dcp="docker compose -f docker-compose.prod.yml"

alias web="firefox --private-window &! exit"
alias chrome="google-chrome &! exit"

export STARSHIP_CONFIG=$HOME/.config/starship/starship.toml
eval "$(starship init zsh)"

# node path
export NODE_HOME=$HOME/programs/node/bin
export PATH=$NODE_HOME:$PATH


# python path
__conda_setup="$('/$HOME/programs/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/$HOME/programs/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/$HOME/programs/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/$HOME/programs/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

