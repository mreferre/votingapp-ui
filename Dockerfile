FROM public.ecr.aws/bitnami/node:10.24.0-prod as build

WORKDIR /app

ADD . /app/

RUN npm install  

RUN npm run build

FROM public.ecr.aws/nginx/nginx:1.19

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
