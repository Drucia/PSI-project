FROM mcr.microsoft.com/dotnet/sdk:3.1-alpine3.12

VOLUME ["/PSI-Backend"]

COPY . /PSI-Backend
WORKDIR /PSI-Backend

ENV PATH $PATH:/root/.dotnet/tools
RUN dotnet tool install --global dotnet-ef --version 3.1.4

CMD ["dotnet-ef", "database", "update"]
