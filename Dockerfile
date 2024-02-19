# Especificar a imagem base
FROM node:16-alpine

# Definir o diretório de trabalho no container
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar os arquivos da aplicação
COPY . .

RUN npx prisma generate

RUN npm run build



# Expor a porta que a aplicação usa
EXPOSE 3333

# Definir o comando para rodar a aplicação
CMD ["npm", "run", "start:migrate:prod" ]

