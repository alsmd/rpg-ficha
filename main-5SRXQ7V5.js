#!/bin/bash

# Defina as variáveis
HTTP_METHOD="GET"
SERVICE="execute-api"
HOST="your-api-id.execute-api.your-region.amazonaws.com"
REGION="your-region"
ENDPOINT="https://${HOST}/your-endpoint"
REQUEST_PAYLOAD="{}"

# Credenciais
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN}

# Data e hora no formato necessário
AMZ_DATE=$(date -u +"%Y%m%dT%H%M%SZ")
DATE_STAMP=$(date -u +"%Y%m%d")

# Função para gerar o hash SHA256
hash_sha256() {
    echo -n "$1" | openssl dgst -sha256 | sed 's/^.* //'
}

# Função para gerar a assinatura HMAC SHA256
hmac_sha256() {
    echo -n "$2" | openssl dgst -sha256 -mac HMAC -macopt key:"$1" | sed 's/^.* //'
}

# Gerar o hash do payload
PAYLOAD_HASH=$(hash_sha256 "$REQUEST_PAYLOAD")

# Gerar a string canônica
CANONICAL_REQUEST="${HTTP_METHOD}
$(echo -n "/" | openssl dgst -sha256 | sed 's/^.* //')
$ENDPOINT
host:${HOST}
x-amz-date:${AMZ_DATE}
x-amz-security-token:${AWS_SESSION_TOKEN}

host;x-amz-date;x-amz-security-token
${PAYLOAD_HASH}"

# Gerar a string para assinatura
STRING_TO_SIGN="AWS4-HMAC-SHA256
${AMZ_DATE}
${DATE_STAMP}/${REGION}/${SERVICE}/aws4_request
$(hash_sha256 "$CANONICAL_REQUEST")"

# Gerar a chave de assinatura
DATE_KEY=$(hmac_sha256 "AWS4${AWS_SECRET_ACCESS_KEY}" "${DATE_STAMP}")
REGION_KEY=$(hmac_sha256 "${DATE_KEY}" "${REGION}")
SERVICE_KEY=$(hmac_sha256 "${REGION_KEY}" "${SERVICE}")
SIGNING_KEY=$(hmac_sha256 "${SERVICE_KEY}" "aws4_request")

# Gerar a assinatura
SIGNATURE=$(hmac_sha256 "${SIGNING_KEY}" "${STRING_TO_SIGN}")

# Montar o cabeçalho de autorização
AUTHORIZATION_HEADER="AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY_ID}/${DATE_STAMP}/${REGION}/${SERVICE}/aws4_request, SignedHeaders=host;x-amz-date;x-amz-security-token, Signature=${SIGNATURE}"

# Fazer a solicitação com curl
curl -X $HTTP_METHOD "$ENDPOINT" \
    -H "Authorization: $AUTHORIZATION_HEADER" \
    -H "x-amz-date: $AMZ_DATE" \
    -H "x-amz-security-token: $AWS_SESSION_TOKEN" \
    -H "x-amz-content-sha256: $PAYLOAD_HASH" \
    -d "$REQUEST_PAYLOAD"
