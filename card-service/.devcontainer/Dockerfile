FROM golang:1.17-bullseye

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y sudo build-essential iputils-ping net-tools vim git

ENV user vscode
ENV workspace /workspace

RUN useradd -d /home/$user -m -s /bin/bash $user
RUN echo "$user:$user" | chpasswd
RUN echo "$user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$user
USER $user
ENV HOME /home/$user
ENV GOPATH /go
ENV GOROOT /usr/local/go

RUN go install golang.org/x/tools/gopls@latest && \
    go install github.com/mdempsky/gocode@latest && \
    go install github.com/uudashr/gopkgs/v2/cmd/gopkgs@latest && \
    go install github.com/ramya-rao-a/go-outline@latest && \
    go install github.com/acroca/go-symbols@latest && \
    go install golang.org/x/tools/cmd/guru@latest && \
    go install golang.org/x/tools/cmd/gorename@latest && \
    go install github.com/cweill/gotests/...@latest && \
    go install github.com/fatih/gomodifytags@latest && \
    go install github.com/josharian/impl@latest && \
    go install github.com/davidrjenni/reftools/cmd/fillstruct@latest && \
    go install github.com/haya14busa/goplay/cmd/goplay@latest && \
    go install github.com/godoctor/godoctor@latest && \
    go install github.com/go-delve/delve/cmd/dlv@latest && \
    go install github.com/stamblerre/gocode@latest && \
    go install github.com/rogpeppe/godef@latest && \
    go install golang.org/x/lint/golint@latest && \
    go install honnef.co/go/tools/cmd/staticcheck@latest && \
    GOBIN=/tmp/ go install github.com/go-delve/delve/cmd/dlv@master && \
    mv /tmp/dlv /go/bin/dlv-dap

RUN sudo mkdir -p ${workspace}
RUN sudo chown -R ${user}:${user} ${workspace}
WORKDIR ${workspace}

EXPOSE 9080