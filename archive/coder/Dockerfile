FROM codercom/code-server:3.5.0

ENV GO_VERSION=1.15 \
    GOOS=linux \
    GOARCH=amd64 \
    GOROOT=/home/go \
    GOPATH=/home/go-tools
ENV PATH=$GOPATH/bin:$GOROOT/bin:$PATH

USER root

RUN chmod g+rw /home && \
    mkdir -p /home/project && \
    mkdir -p /home/go && \
    mkdir -p /home/go-tools && \
    chown -R coder:coder /home/go && \
    chown -R coder:coder /home/go-tools;

RUN apt-get update
RUN apt-get install -y gcc

# install Go
RUN curl -fsSL https://storage.googleapis.com/golang/go$GO_VERSION.$GOOS-$GOARCH.tar.gz | tar -C /home -xzv

# # install VS Code Go tools: https://github.com/Microsoft/vscode-go/blob/058eccf17f1b0eebd607581591828531d768b98e/src/goInstallTools.ts#L19-L45
# RUN go get -u -v github.com/mdempsky/gocode && \
#     go get -u -v github.com/uudashr/gopkgs/cmd/gopkgs && \
#     go get -u -v github.com/ramya-rao-a/go-outline && \
#     go get -u -v github.com/acroca/go-symbols && \
#     go get -u -v golang.org/x/tools/cmd/guru && \
#     go get -u -v golang.org/x/tools/cmd/gorename && \
#     go get -u -v github.com/fatih/gomodifytags && \
#     go get -u -v github.com/haya14busa/goplay/cmd/goplay && \
#     go get -u -v github.com/josharian/impl && \
#     go get -u -v github.com/tylerb/gotype-live && \
#     go get -u -v github.com/rogpeppe/godef && \
#     go get -u -v github.com/zmb3/gogetdoc && \
#     go get -u -v golang.org/x/tools/cmd/goimports && \
#     go get -u -v github.com/sqs/goreturns && \
#     go get -u -v winterdrache.de/goformat/goformat && \
#     go get -u -v golang.org/x/lint/golint && \
#     go get -u -v github.com/cweill/gotests/... && \
#     go get -u -v github.com/alecthomas/gometalinter && \
#     go get -u -v honnef.co/go/tools/... && \
#     GO111MODULE=on go get github.com/golangci/golangci-lint/cmd/golangci-lint && \
#     go get -u -v github.com/mgechev/revive && \
#     go get -u -v github.com/sourcegraph/go-langserver && \
#     go get -u -v github.com/go-delve/delve/cmd/dlv && \
#     go get -u -v github.com/davidrjenni/reftools/cmd/fillstruct && \
#     go get -u -v github.com/godoctor/godoctor

# RUN go get -u -v -d github.com/stamblerre/gocode && \
#     go build -o $GOPATH/bin/gocode-gomod github.com/stamblerre/gocode

ENV PATH=$PATH:$GOPATH/bin

ENV GO_VERSION=1.15 \
    GOOS=linux \
    GOARCH=amd64 \
    GOROOT=/home/go \
    GOPATH=/home/go-tools
ENV PATH=$GOPATH/bin:$GOROOT/bin:$PATH