
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="robbyrussell"



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

alias dc="docker compose"
alias dcp="docker compose -f docker-compose.prod.yml"

alias web="firefox --private-window & disown & exit"

#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
