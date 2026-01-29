
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="agnoster"



plugins=(git zsh-autosuggestions zsh-syntax-highlighting)


source $ZSH/oh-my-zsh.sh

export PATH="$PATH:/opt/nvim-linux-x86_64/bin"

export ANDROID_HOME=$HOME/programs/android_sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

alias dc='docker compose'
alias prod="docker compose -f docker-compose.prod.yml"


alias vim="nvim"
alias v="nvim"
alias t="tmux"
alias y="yazi"

alias dc="docker compose"
alias dcp="docker compose -f docker-compose.prod.yml"
alias dco="docker compose -f docker-compose.override.yml"

alias firefox='/home/amine/programs/firefox/firefox'
alias web="firefox --private-window &! exit"
alias chrome="google-chrome &! exit"
alias fx="firefox &! exit"


export STARSHIP_CONFIG=$HOME/.config/starship/starship.toml
eval "$(starship init zsh)"

# node path
export NODE_HOME=$HOME/programs/node/bin
export PATH=$NODE_HOME:$PATH


# python path
__conda_setup="$('$HOME/programs/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "$HOME/programs/anaconda3/etc/profile.d/conda.sh" ]; then
# . "$HOME/programs/anaconda3/etc/profile.d/conda.sh"  # commented out by conda initialize
    else
# export PATH="$HOME/programs/anaconda3/bin:$PATH"  # commented out by conda initialize
    fi
fi
# unset __conda_setup
# <<< conda initialize <<<
# export PATH=$HOME/programs/anaconda3/bin:$PATH
export DOCKER_HOST=unix:///run/docker.sock


# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/home/amine/programs/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/home/amine/programs/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/home/amine/programs/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/home/amine/programs/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

export PATH=$PATH:/home/amine/programs/android_sdk/emulator:/home/amine/programs/android_sdk/platform-tools

alias k=kubectl
export KUBE_EDITOR="nvim"
