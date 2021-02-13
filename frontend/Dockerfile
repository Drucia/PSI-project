# Can only run x86_64
FROM node:14-alpine3.12

# ENV CHROME_BIN="/usr/bin/chromium-browser"		 
VOLUME [ "/PSI-App" ]

# RUN apk add chromium		
RUN npm install -g @angular/cli

WORKDIR /PSI-App

EXPOSE 4200

CMD ["ng", "serve", "--host=0.0.0.0"]
