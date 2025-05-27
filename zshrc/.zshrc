
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="agnoster"



plugins=(git zsh-autosuggestions)


source $ZSH/oh-my-zsh.sh

export PATH="$PATH:/opt/nvim-linux-x86_64/bin"


export NODE_HOME=$HOME/programs/node/bin
export PYTHON_HOME=$HOME/anaconda3/bin

export PATH=$NODE_HOME:$PATH
export PATH=$PYTHON_HOME:$PATH

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

#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/home/amine/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/home/amine/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/home/amine/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/home/amine/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

